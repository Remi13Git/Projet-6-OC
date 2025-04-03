import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Article } from '../../core/interfaces/article.interface'; // Assurez-vous que Article est bien importé

/**
 * Service pour gérer les articles.
 * Fournit des méthodes pour récupérer, créer et trier les articles.
 */
@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private baseUrl = 'http://localhost:8080/api/articles';

  constructor(private http: HttpClient) { }

  /**
   * Récupère tous les articles et les trie selon l'ordre spécifié.
   * 
   * @param sortOrder L'ordre de tri des articles. Peut être 'asc' (croissant) ou 'desc' (décroissant).
   * @returns Un Observable qui émet une liste d'articles triés.
   */
  getAllArticles(sortOrder: string = 'desc'): Observable<Article[]> {
    return this.http.get<Article[]>(this.baseUrl).pipe(
      // Trie les articles après leur récupération
      map((articles: Article[]) => this.sortArticles(articles, sortOrder)),
      catchError(err => {
        console.error('Erreur lors du chargement des articles', err);
        return throwError(() => err);  // Relance l'erreur
      })
    );
  }

  /**
   * Trie une liste d'articles en fonction de la date de création.
   * 
   * @param articles La liste des articles à trier.
   * @param sortOrder L'ordre de tri des articles. Peut être 'asc' pour du plus ancien au plus récent ou 'desc' pour du plus récent au plus ancien.
   * @returns La liste triée des articles.
   */
  private sortArticles(articles: Article[], sortOrder: string): Article[] {
    return articles.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      if (sortOrder === 'desc') {
        return dateB - dateA;  // Trier du plus récent au plus ancien
      } else {
        return dateA - dateB;  // Trier du plus ancien au plus récent
      }
    });
  }

  /**
   * Crée un nouvel article en envoyant une requête POST.
   * 
   * @param data Les données de l'article à créer.
   * @returns Un Observable qui émet la réponse de l'API après la création de l'article.
   */
  createArticle(data: any): Observable<any> {
    const token = localStorage.getItem('authToken');  // Exemple avec token d'authentification
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.post(this.baseUrl, data, { headers });
  }

  /**
   * Récupère un article spécifique en fonction de son ID.
   * 
   * @param id L'ID de l'article à récupérer.
   * @returns Un Observable qui émet l'article trouvé, ou `null` si l'article n'existe pas.
   */
  getArticleById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      catchError(err => {
        if (err.status === 404) {
          return of(null);  // Renvoie `null` si l'article est introuvable
        }
        return throwError(() => err);  // Relance l'erreur pour d'autres cas
      })
    );
  }
}
