import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private baseUrl = 'http://localhost:8080/api/articles';

  constructor(private http: HttpClient) { }

  createArticle(data: any): Observable<any> {
    // Si vous utilisez un token pour l'authentification, l'ajouter dans les headers
    const token = localStorage.getItem('authToken'); // Exemple
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.post(this.baseUrl, data, { headers });
  }

  getAllArticles(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getArticleById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
}
