import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl = 'http://localhost:8080/api/comments';

  constructor(private http: HttpClient) {}

  // Récupérer les commentaires d'un article
  getComments(articleId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/article/${articleId}`);
  }

  // Ajouter un commentaire à un article
  addComment(articleId: number, comment: any) {
    const authToken = localStorage.getItem('authToken'); // Récupère le token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`, // Ajoute le token
      'Content-Type': 'application/json'
    });
  
    return this.http.post(`${this.baseUrl}/article/${articleId}`, comment, { headers });
  }
}
