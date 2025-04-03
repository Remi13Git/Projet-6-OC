import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Service pour gérer les abonnements aux topics.
 * Permet de s'abonner à un topic et de récupérer les topics auxquels l'utilisateur est abonné.
 */
@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private baseUrl = 'http://localhost:8080/api/subscriptions';

  constructor(private http: HttpClient) { }

  /**
   * Récupère le token d'authentification depuis le localStorage.
   * 
   * @returns Le token d'authentification ou null si aucun token n'est trouvé.
   */
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Crée les en-têtes HTTP nécessaires, en incluant l'authentification avec le token.
   * 
   * @returns Un objet HttpHeaders contenant le token d'authentification, si disponible.
   */
  private createAuthHeaders(): HttpHeaders {
    const token = this.getAuthToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  /**
   * S'abonne à un topic spécifique en utilisant son identifiant.
   * 
   * @param topicId L'identifiant du topic auquel l'utilisateur souhaite s'abonner.
   * @returns Un Observable qui émet la réponse de l'API après l'abonnement.
   */
  subscribeToTopic(topicId: number): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.post<any>(this.baseUrl, { topicId }, { headers });
  }

  /**
   * Récupère la liste des identifiants des topics auxquels l'utilisateur est abonné.
   * 
   * @returns Un Observable qui émet un tableau d'identifiants de topics auxquels l'utilisateur est abonné.
   */
  getSubscribedTopicIds(): Observable<number[]> {
    const headers = this.createAuthHeaders();
    return this.http.get<number[]>(this.baseUrl, { headers });
  }
}
