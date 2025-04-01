import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  shouldDisplayNavItems: boolean = true; // Contrôle l'affichage des nav-items
  shouldDisplayNavbar: boolean = true;   // Contrôle l'affichage de la navbar

  // Injection d'AuthService dans le constructeur
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    // Observer les changements de navigation pour déterminer si la navbar doit être affichée
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateNavbarDisplay();  // Mettre à jour l'affichage de la navbar
      this.updateNavItemsDisplay(); // Mettre à jour l'affichage des éléments du menu
    });

    this.updateNavbarDisplay(); // Mettre à jour dès le premier chargement
    this.updateNavItemsDisplay(); // Mettre à jour dès le premier chargement
  }

  // Met à jour l'affichage de la navbar en fonction de la route
  updateNavbarDisplay(): void {
    const currentRoute = this.router.url;
    // Masque la navbar sur la route '/'
    this.shouldDisplayNavbar = currentRoute !== '/';
  }

  // Met à jour l'affichage des éléments du menu en fonction de la route
  updateNavItemsDisplay(): void {
    const currentRoute = this.router.url;
    // Masque les nav-items sur /login et /register
    this.shouldDisplayNavItems = !(currentRoute === '/login' || currentRoute === '/register');
  }

  // Méthode pour gérer la déconnexion
  logout(): void {
    this.authService.logout(); // Appeler la méthode logout du service AuthService pour retirer le token
    this.router.navigate(['/']); 
  }
}
