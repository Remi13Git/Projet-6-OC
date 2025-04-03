import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Service pour gérer l'authentification (connexion et inscription).
 * Fournit des méthodes pour s'inscrire, se connecter, gérer le token et l'état de la connexion.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  /**
   * Inscrit un nouvel utilisateur.
   * 
   * @param data Les données d'inscription à envoyer à l'API.
   * @returns Un Observable qui émet la réponse de l'API.
   */
  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  /**
   * Gère l'inscription d'un utilisateur, y compris la gestion des messages et des erreurs.
   * 
   * @param data Les données d'inscription à envoyer à l'API.
   * @returns Un Observable qui émet un objet contenant le succès de l'inscription et un message associé.
   */
  registerUser(data: any): Observable<any> {
    return new Observable((observer) => {
      this.register(data).subscribe({
        next: (response) => {
          observer.next({
            success: true,
            message: 'Inscription réussie ! Redirection...'
          });
        },
        error: (error) => {
          let message = error.error ? error.error : 'Erreur lors de l\'inscription';
          observer.next({
            success: false,
            message: message
          });
        }
      });
    });
  }

  /**
   * Connecte un utilisateur et gère l'authentification.
   * Si la connexion réussie, le token d'authentification est sauvegardé.
   * 
   * @param data Les informations de connexion (email/username et mot de passe).
   * @returns Un Observable qui émet un objet avec un indicateur de succès et un message.
   */
  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  /**
   * Gère la connexion de l'utilisateur, la sauvegarde du token et la gestion des messages d'erreur.
   * 
   * @param data Les informations de connexion (email/username et mot de passe).
   * @returns Un Observable qui émet un objet avec le succès de l'authentification et un message.
   */
  authenticate(data: any): Observable<any> {
    return new Observable((observer) => {
      this.login(data).subscribe({
        next: (response) => {
          if (response?.token) {
            this.saveToken(response.token); // Sauvegarde du token dans le localStorage
            observer.next({
              success: true,
              message: response?.message || 'Connexion réussie'
            });
          } else {
            observer.next({
              success: false,
              message: 'Erreur, aucun token reçu'
            });
          }
        },
        error: (error) => {
          let message = 'Veuillez vérifier vos identifiants';
          if (error.status === 403) {
            message = 'Accès refusé, veuillez vérifier vos identifiants';
          } else {
            message = error?.error?.message || message;
          }
          observer.next({
            success: false,
            message
          });
        }
      });
    });
  }

  /**
   * Sauvegarde le token d'authentification dans le localStorage.
   * 
   * @param token Le token d'authentification à sauvegarder.
   */
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  /**
   * Récupère le token d'authentification stocké dans le localStorage.
   * 
   * @returns Le token d'authentification, ou `null` s'il n'existe pas.
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Vérifie si l'utilisateur est connecté en vérifiant l'existence du token dans le localStorage.
   * 
   * @returns `true` si l'utilisateur est connecté (token présent), sinon `false`.
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Déconnecte l'utilisateur en supprimant le token du localStorage.
   */
  logout(): void {
    localStorage.removeItem('authToken');
  }

  /**
   * Génère les en-têtes HTTP nécessaires pour les requêtes nécessitant une authentification.
   * 
   * @returns Un objet `HttpHeaders` avec le token d'authentification.
   */
  getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
  }
}
