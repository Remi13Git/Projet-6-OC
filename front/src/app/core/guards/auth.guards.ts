import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';  // Importer AuthService

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): boolean {
    if (!this.authService.isLoggedIn()) {  // Vérifier si l'utilisateur est authentifié
      this.router.navigate(['/']);  // Rediriger vers la page d'accueil si non authentifié
      return false;
    }
    return true;
  }
}
