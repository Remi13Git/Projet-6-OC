import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  articles: any[] = [];
  message: string = '';
  sortOrder: string = 'desc'; // Par défaut, on trie du plus récent au plus ancien

  constructor(private articleService: ArticleService, private router: Router) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this.articleService.getAllArticles().subscribe({
      next: (data) => {
        this.articles = this.sortArticles(data);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des articles', err);
        this.message = 'Erreur lors du chargement des articles';
      }
    });
  }

  sortArticles(articles: any[]): any[] {
    return articles.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      if (this.sortOrder === 'desc') {
        return dateB - dateA; // Trier du plus récent au plus ancien
      } else {
        return dateA - dateB; // Trier du plus ancien au plus récent
      }
    });
  }

  goToArticle(articleId: number): void {
    this.router.navigate(['/article', articleId]);
  }

  // Permet de basculer entre 'desc' et 'asc' en cliquant sur la flèche
  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc'; 
    this.loadArticles(); // Recharger les articles avec le nouveau tri
  }
}
