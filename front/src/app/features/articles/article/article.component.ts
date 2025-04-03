import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../../core/services/article.service';
import { Router } from '@angular/router';
import { Article } from '../../../core/interfaces/article.interface';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  articles: Article[] = [];
  message: string = '';
  sortOrder: string = 'desc'; // Par défaut, on trie du plus récent au plus ancien

  constructor(private articleService: ArticleService, private router: Router) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  // Charger les articles depuis le service avec l'ordre de tri actuel
  loadArticles(): void {
    this.articleService.getAllArticles(this.sortOrder).subscribe({
      next: (data) => {
        this.articles = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des articles', err);
        this.message = 'Erreur lors du chargement des articles';
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

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
