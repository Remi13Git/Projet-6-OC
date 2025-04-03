import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Log l'erreur dans la console pour le débogage
          console.error('Utilisateur non autorisé ou non authentifié. Redirection vers la page de connexion.');

          // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
          this.router.navigate(['/']);
        }
        throw error;
      })
    );
  }
}
