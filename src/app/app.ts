import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly router = inject(Router);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    const target = event.target as HTMLElement | null;
    const anchor = target?.closest('a') as HTMLAnchorElement | null;
    if (!anchor) return;

    const rawHref = anchor.getAttribute('href');
    if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('javascript:') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:')) {
      return;
    }

    if (anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) {
      return;
    }

    if (/^https?:\/\//i.test(rawHref)) {
      return;
    }

    // Interceptar navegación interna para usar Angular Router (SPA sin recarga de página ni .html)
    event.preventDefault();
    let cleanUrl = rawHref.startsWith('/') ? rawHref : `/${rawHref}`;
    cleanUrl = cleanUrl.replace(/^\/index\.html/i, '/').replace(/\.html(?=[?#]|$)/i, '');
    this.router.navigateByUrl(cleanUrl).then(() => {
      if (!cleanUrl.includes('#')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
}
