import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Service pour gérer les commentaires d'articles.
 * Permet de récupérer les commentaires d'un article et d'ajouter un commentaire.
 */
@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl = 'http://localhost:8080/api/comments';

  constructor(private http: HttpClient) {}

  /**
   * Récupère tous les commentaires associés à un article spécifique.
   * 
   * @param articleId L'identifiant de l'article pour lequel récupérer les commentaires.
   * @returns Un Observable qui émet la liste des commentaires associés à l'article.
   */
  getComments(articleId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/article/${articleId}`);
  }

  /**
   * Ajoute un nouveau commentaire à un article.
   * 
   * @param articleId L'identifiant de l'article auquel ajouter le commentaire.
   * @param comment Le contenu du commentaire à ajouter.
   * @returns Un Observable représentant la réponse de l'API après l'ajout du commentaire.
   */
  addComment(articleId: number, comment: any): Observable<any> {
    const authToken = localStorage.getItem('authToken'); // Récupère le token d'authentification
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`, // Ajoute le token à l'en-tête
      'Content-Type': 'application/json' // Spécifie que le contenu de la requête est en JSON
    });
  
    return this.http.post<any>(`${this.baseUrl}/article/${articleId}`, comment, { headers });
  }
}
