import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private baseUrl = 'http://localhost:8080/api/subscriptions';

  constructor(private http: HttpClient) { }

  // Fonction pour obtenir le token depuis le service d'authentification ou le stockage local
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Fonction pour ajouter l'header d'authentification
  private createAuthHeaders() {
    const token = this.getAuthToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // S'abonner à un topic
  subscribeToTopic(topicId: number): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.post<any>(this.baseUrl, { topicId }, { headers });
  }

  // Récupérer la liste des topic IDs auxquels l'utilisateur est abonné
  getSubscribedTopicIds(): Observable<number[]> {
    const headers = this.createAuthHeaders();
    return this.http.get<number[]>(this.baseUrl, { headers });
  }
}
