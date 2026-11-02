/**
 * CURSOS.SERVICE.JS - Servicio de Catálogo, Modalidades y Control de Aforo en Tiempo Real
 */
const CursosService = {
  _memCache: null,

  /**
   * Devuelve instantáneamente (0ms) la lista de cursos en caché o semilla inicial
   * para renderizar la interfaz sin esperar a la red (Stale-While-Revalidate).
   */
  getCachedCursos(modalidad = 'TODOS') {
    let cursos = this._memCache;
    if (!cursos || cursos.length === 0) {
      try {
        const raw = localStorage.getItem('app_cursos_cache');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            cursos = this._normalizeCursos(parsed);
            this._memCache = cursos;
          }
        }
      } catch (_) {}
    }
    if (!cursos || cursos.length === 0) {
      cursos = [...CONFIG.INITIAL_COURSES];
    }
    return this.filterByModalidad(cursos, modalidad);
  },

  /**
   * Obtiene todos los cursos públicos desde cursos-service (vía API Gateway)
   * Si el backend no está activo, utiliza los cursos locales sincronizados.
   */
  async getCursos(modalidad = 'TODOS') {
    let cursos = [];
    try {
      const data = await API.request('/cursos');
      if (Array.isArray(data) && data.length > 0) {
        cursos = this._normalizeCursos(data);
        this._memCache = cursos;
        localStorage.setItem('app_cursos_cache', JSON.stringify(cursos));
      } else {
        cursos = this.getCachedCursos('TODOS');
      }
    } catch (error) {
      console.warn('[CursosService] Usando catálogo en caché local:', error.message);
      cursos = this.getCachedCursos('TODOS');
    }

    return this.filterByModalidad(cursos, modalidad);
  },

  /**
   * Obtiene el detalle de un curso específico por su UUID
   */
  async getCursoById(id) {
    try {
      const data = await API.request(`/cursos/${id}`);
      if (data && data.id) {
        return this._normalizeSingleCurso(data, 0);
      }
    } catch (error) {
      console.warn(`[CursosService] Buscando curso ${id} en caché local.`);
    }

    const cached = this.getCachedCursos('TODOS');
    return cached.find(c => c.id === id) || CONFIG.INITIAL_COURSES.find(c => c.id === id) || CONFIG.INITIAL_COURSES[0];
  },

  /**
   * Filtra una lista de cursos por modalidad ('TODOS', 'VIRTUAL', 'PRESENCIAL')
   */
  filterByModalidad(cursos, modalidad) {
    if (!modalidad || modalidad === 'TODOS') return cursos;
    return cursos.filter(c => c.modalidad && c.modalidad.toUpperCase() === modalidad.toUpperCase());
  },

  /**
   * Descuenta 1 vacante del curso en el backend y/o caché local
   */
  async descontarAforo(cursoId) {
    this._memCache = null;
    if (typeof API !== 'undefined' && API.clearCache) API.clearCache();
    try {
      return await API.request(`/cursos/${cursoId}/descontar-aforo`, { method: 'PUT' });
    } catch (err) {
      const cached = JSON.parse(localStorage.getItem('app_cursos_cache') || 'null') || [...CONFIG.INITIAL_COURSES];
      const idx = cached.findIndex(c => c.id === cursoId);
      if (idx !== -1 && cached[idx].aforoDisponible > 0) {
        cached[idx].aforoDisponible -= 1;
        localStorage.setItem('app_cursos_cache', JSON.stringify(cached));
      }
      return cached[idx];
    }
  },

  /**
   * Libera 1 vacante del curso cuando una reserva expira o se cancela
   */
  async liberarAforo(cursoId) {
    this._memCache = null;
    if (typeof API !== 'undefined' && API.clearCache) API.clearCache();
    try {
      return await API.request(`/cursos/${cursoId}/liberar-aforo`, { method: 'PUT' });
    } catch (err) {
      const cached = JSON.parse(localStorage.getItem('app_cursos_cache') || 'null') || [...CONFIG.INITIAL_COURSES];
      const idx = cached.findIndex(c => c.id === cursoId);
      if (idx !== -1 && cached[idx].aforoDisponible < cached[idx].aforoMaximo) {
        cached[idx].aforoDisponible += 1;
        localStorage.setItem('app_cursos_cache', JSON.stringify(cached));
      }
      return cached[idx];
    }
  },

  /**
   * Normaliza los datos provenientes de la entidad JPA Curso.java
   */
  _normalizeCursos(list) {
    return list.map((item, index) => this._normalizeSingleCurso(item, index));
  },

  _normalizeSingleCurso(item, index = 0) {
    const images = [
      'assets/images/all-img/c1.png',
      'assets/images/all-img/c2.png',
      'assets/images/all-img/c3.png',
      'assets/images/all-img/c4.png',
      'assets/images/all-img/c5.png',
      'assets/images/all-img/c6.png'
    ];
    const seedMatch = CONFIG.INITIAL_COURSES.find(c => c.id === item.id || c.titulo === item.titulo);

    return {
      id: item.id,
      titulo: item.titulo || 'Curso Especializado',
      descripcion: item.descripcion || 'Formación práctica con certificación oficial.',
      modalidad: item.modalidad || 'VIRTUAL',
      precio: Number(item.precio || 150.00),
      horario: item.horario || 'Horario flexible',
      fechaInicio: item.fechaInicio,
      fechaFin: item.fechaFin,
      aforoMaximo: item.aforoMaximo !== undefined ? item.aforoMaximo : 30,
      aforoDisponible: item.aforoDisponible !== undefined ? item.aforoDisponible : 15,
      enlaceClase: item.enlaceClase || (seedMatch ? seedMatch.enlaceClase : 'https://meet.google.com/abc-defg-hij'),
      direccionClase: item.direccionClase || (seedMatch ? seedMatch.direccionClase : 'Av. Universitaria 1234, Lima'),
      aula: item.aula || (seedMatch ? seedMatch.aula : 'Laboratorio 204'),
      estado: item.estado || 'PUBLICADO',
      docenteId: item.docenteId,
      docente: item.docente || (seedMatch ? seedMatch.docente : 'Docente Especialista'),
      imagen: item.imagen || (seedMatch ? seedMatch.imagen : images[index % images.length])
    };
  }
};
