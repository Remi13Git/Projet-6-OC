import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../services/article.service';
import { CommentService } from '../services/comment.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common'; // Import du service Location

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss']
})
export class ArticleDetailComponent implements OnInit {
  article: any;
  articleId!: number;
  comments: any[] = [];
  commentForm: FormGroup;
  commentMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private commentService: CommentService,
    private fb: FormBuilder,
    private location: Location // Injection du service Location
  ) {
    this.commentForm = this.fb.group({
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.articleId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadArticle();
    this.loadComments();
  }

  loadArticle(): void {
    this.articleService.getArticleById(this.articleId).subscribe(data => {
      this.article = data;
    });
  }

  loadComments(): void {
    this.commentService.getComments(this.articleId).subscribe(data => {
      this.comments = data;
    });
  }

  onSubmitComment(): void {
    if (this.commentForm.valid) {
      this.commentService.addComment(this.articleId, this.commentForm.value).subscribe({
        next: (response: any) => {
          this.commentMessage = response.message || 'Commentaire ajouté avec succès';
          this.commentForm.reset();
          this.loadComments(); // recharge la liste des commentaires
        },
        error: (error) => {
          this.commentMessage = error.error ? error.error : 'Erreur lors de l\'ajout du commentaire';
        }
      });
    }
  }

  // Fonction pour revenir à la page précédente
  goBack(): void {
    this.location.back(); // Permet de revenir à la page précédente
  }
}
