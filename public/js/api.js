/**
 * API.JS - Cliente HTTP Centralizado con JWT, Deduplicación en Vuelo, Caché Rápido y Resiliencia
 */
const API = {
  _inflightGet: new Map(),
  _getCache: new Map(),
  _CACHE_TTL_MS: 3000,

  clearCache() {
    this._getCache.clear();
  },

  /**
   * Realiza peticiones HTTP inyectando automáticamente el Token JWT.
   * Incluye deduplicación de peticiones GET simultáneas y fallback directo al microservicio.
   */
  async request(endpoint, options = {}) {
    const method = (options.method || 'GET').toUpperCase();

    // Si es una mutación (POST, PUT, PATCH, DELETE), invalidar caché de lectura
    if (method !== 'GET') {
      this.clearCache();
    } else if (!options.noCache) {
      const cached = this._getCache.get(endpoint);
      if (cached && (Date.now() - cached.ts) < this._CACHE_TTL_MS) {
        return cached.data;
      }
      if (this._inflightGet.has(endpoint)) {
        return this._inflightGet.get(endpoint);
      }
    }

    const execPromise = this._executeRequest(endpoint, options, method);

    if (method === 'GET' && !options.noCache) {
      this._inflightGet.set(endpoint, execPromise);
      execPromise.finally(() => {
        this._inflightGet.delete(endpoint);
      });
    }

    return execPromise;
  },

  async _executeRequest(endpoint, options, method) {
    const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
    const isRealJwt = token && token.includes('.');

    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    if (isRealJwt) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const fetchOptions = {
      ...options,
      method,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {})
      }
    };

    const gatewayUrl = endpoint.startsWith('http')
      ? endpoint
      : `${CONFIG.API_BASE_URL}${endpoint}`;

    try {
      const response = await this._fetchWithTimeout(gatewayUrl, fetchOptions, 4000);
      const data = await this._handleResponse(response);
      if (method === 'GET') {
        this._getCache.set(endpoint, { data, ts: Date.now() });
      }
      return data;
    } catch (gatewayError) {
      // Si el Gateway responde 401 en una ruta administrativa (ej. /auth/usuarios sin JWT o sesión demo)
      // o errores de pasarela (404, 502, 503, 504) o caída de red, usar el microservicio directo:
      const isGatewayRoutingError = gatewayError.status && (
        [404, 502, 503, 504].includes(gatewayError.status) ||
        (gatewayError.status === 401 && endpoint.startsWith('/auth/usuarios'))
      );

      if (gatewayError.status && !isGatewayRoutingError) {
        throw gatewayError;
      }

      const directUrl = this._resolveDirectUrl(endpoint);
      if (directUrl && directUrl !== gatewayUrl) {
        try {
          const response = await this._fetchWithTimeout(directUrl, fetchOptions, 4000);
          const data = await this._handleResponse(response);
          if (method === 'GET') {
            this._getCache.set(endpoint, { data, ts: Date.now() });
          }
          return data;
        } catch (directError) {
          throw directError;
        }
      }
      throw gatewayError;
    }
  },

  /**
   * Resuelve el puerto directo del microservicio (usando 127.0.0.1 para máxima velocidad en Windows)
   */
  _resolveDirectUrl(endpoint) {
    if (endpoint.startsWith('/auth')) {
      return `http://127.0.0.1:8081/api${endpoint}`;
    }
    if (endpoint.startsWith('/cursos')) {
      return `http://127.0.0.1:8082/api${endpoint}`;
    }
    if (endpoint.startsWith('/pedidos') || endpoint.startsWith('/pagos') || endpoint.startsWith('/comprobantes')) {
      return `http://127.0.0.1:8083/api${endpoint}`;
    }
    return null;
  },

  /**
   * Fetch con controlador de tiempo de espera (AbortController)
   */
  async _fetchWithTimeout(url, options, timeout = 4000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);
      return response;
    } catch (err) {
      clearTimeout(id);
      throw err;
    }
  },

  /**
   * Procesa la respuesta y captura errores HTTP
   */
  async _handleResponse(response) {
    let data = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }

    if (!response.ok) {
      const error = new Error(
        (data && (data.message || data.error || data.mensaje)) ||
        `Error HTTP ${response.status}`
      );
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }
};
