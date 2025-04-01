import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private baseUrl = 'http://localhost:8080/api/profile';

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('authToken'); // Récupérer le token depuis le localStorage
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', 'Bearer ' + token);
    }
    return headers;
  }

  // Récupérer le profil de l'utilisateur
  getProfile(): Observable<any> {
    return this.http.get(this.baseUrl, { headers: this.getHeaders() });
  }

  // Mettre à jour le profil
  updateProfile(data: any): Observable<any> {
    return this.http.put(this.baseUrl, data, { headers: this.getHeaders() });
  }
  
  // Récupérer les thèmes abonnés par l'utilisateur
  getSubscribedTopics(): Observable<any> {
    return this.http.get(this.baseUrl + '/subscriptions', { headers: this.getHeaders() });
  }

  unsubscribeFromTopic(topicId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/subscriptions/${topicId}`, { headers: this.getHeaders() });
  }
  
}
