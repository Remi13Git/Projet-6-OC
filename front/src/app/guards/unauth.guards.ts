import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';  // Importer AuthService

@Injectable({ providedIn: 'root' })
export class UnauthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {  // Vérifier si l'utilisateur est déjà authentifié
      this.router.navigate(['/profil']);  // Rediriger vers le profil si l'utilisateur est connecté
      return false;
    }
    return true;
  }
}
