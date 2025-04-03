import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Topic } from '../../core/interfaces/topic.interface';

/**
 * Service pour gérer les topics dans l'application.
 * Permet de récupérer la liste des topics, l'abonnement à un topic et l'obtention des topics auxquels l'utilisateur est abonné.
 */
@Injectable({
  providedIn: 'root'
})
export class TopicService {
  private baseUrl = 'http://localhost:8080/api/topics';
  private subscriptionUrl = 'http://localhost:8080/api/subscriptions';

  constructor(private http: HttpClient) { }

  /**
   * Récupère la liste de tous les topics.
   * 
   * @returns Un Observable qui émet un tableau de topics.
   */
  getTopics(): Observable<Topic[]> {
    return this.http.get<Topic[]>(this.baseUrl);
  }

  /**
   * Récupère les identifiants des topics auxquels l'utilisateur est abonné.
   * 
   * @returns Un Observable qui émet un tableau d'identifiants de topics.
   */
  getSubscribedTopicIds(): Observable<number[]> {
    const headers = this.createAuthHeaders();
    return this.http.get<number[]>(this.subscriptionUrl, { headers });
  }

  /**
   * Abonne l'utilisateur à un topic spécifique en utilisant son identifiant.
   * 
   * @param topicId L'identifiant du topic auquel l'utilisateur souhaite s'abonner.
   * @returns Un Observable qui émet la réponse de l'API après l'abonnement.
   */
  subscribeToTopic(topicId: number): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.post<any>(this.subscriptionUrl, { topicId }, { headers });
  }

  /**
   * Récupère le token d'authentification depuis le localStorage.
   * 
   * @returns Le token d'authentification ou null si aucun token n'est trouvé.
   */
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Crée les en-têtes HTTP nécessaires, incluant le token d'authentification.
   * 
   * @returns Un objet HttpHeaders contenant le token d'authentification, si disponible.
   */
  private createAuthHeaders(): HttpHeaders {
    const token = this.getAuthToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }
}
