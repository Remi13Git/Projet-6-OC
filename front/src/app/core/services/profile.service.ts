import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.service';

/**
 * Service pour gérer le profil de l'utilisateur.
 * Permet de récupérer, mettre à jour le profil et gérer les abonnements aux sujets.
 */
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private baseUrl = 'http://localhost:8080/api/profile';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Récupère les en-têtes nécessaires pour les requêtes, y compris le token d'authentification.
   * 
   * @returns Les en-têtes HttpHeaders contenant le token d'authentification.
   */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); // Récupérer le token depuis le localStorage
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', 'Bearer ' + token);
    }
    return headers;
  }

  /**
   * Récupère le profil de l'utilisateur connecté.
   * 
   * @returns Un Observable qui émet les données du profil de l'utilisateur.
   */
  getProfile(): Observable<any> {
    return this.http.get<any>(this.baseUrl, { headers: this.getHeaders() });
  }

  /**
   * Met à jour le profil de l'utilisateur connecté.
   * 
   * @param data Les données à mettre à jour pour le profil de l'utilisateur.
   * @returns Un Observable représentant la réponse de l'API après la mise à jour.
   */
  updateProfile(data: any): Observable<any> {
    return this.http.put<any>(this.baseUrl, data, { headers: this.getHeaders() }).pipe(
      map(response => {
        // Si le backend renvoie un nouveau token, on le sauvegarde
        if (response && response.token) {
          // Par exemple, via AuthService
          this.authService.saveToken(response.token);
        }
        return response;
      }),
      catchError(err => {
        return throwError(() => err);
      })
    );
  }
  

  /**
   * Récupère les sujets auxquels l'utilisateur est abonné.
   * 
   * @returns Un Observable qui émet la liste des sujets abonnés par l'utilisateur.
   */
  getSubscribedTopics(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/subscriptions`, { headers: this.getHeaders() });
  }

  /**
   * Se désabonne d'un sujet.
   * 
   * @param topicId L'identifiant du sujet à partir duquel l'utilisateur veut se désabonner.
   * @returns Un Observable représentant la réponse de l'API après la désinscription.
   */
  unsubscribeFromTopic(topicId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/subscriptions/${topicId}`, { headers: this.getHeaders() });
  }
}
