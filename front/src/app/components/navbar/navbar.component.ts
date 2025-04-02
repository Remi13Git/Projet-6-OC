import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  
  shouldDisplayNavItems: boolean = true;
  shouldDisplayNavbar: boolean = true;
  activeRoute: string = '';
  isMobile: boolean = false;
  menuOpen: boolean = false;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.activeRoute = event.urlAfterRedirects;
      this.updateNavbarDisplay();
      this.updateNavItemsDisplay();
    });

    this.updateNavbarDisplay();
    this.updateNavItemsDisplay();
    this.checkScreenSize();
  }

  updateNavbarDisplay(): void {
    const currentRoute = this.router.url;
    const isAuthPage = currentRoute === '/login' || currentRoute === '/register';
  
    // La navbar est cachée sur la route "/"
    // Elle est aussi cachée sur "/login" et "/register" si l'écran est inférieur à 650px
    this.shouldDisplayNavbar = !(currentRoute === '/' || (this.isMobile && isAuthPage));
  }
  

  updateNavItemsDisplay(): void {
    const currentRoute = this.router.url;
    this.shouldDisplayNavItems = !(currentRoute === '/login' || currentRoute === '/register');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  // Ouvrir / Fermer le menu mobile
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  // Vérifie la taille de l'écran et met à jour la navbar
  @HostListener('window:resize', ['$event'])
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 650;
    this.updateNavbarDisplay();  // Vérifie si la navbar doit être cachée
  }
}
