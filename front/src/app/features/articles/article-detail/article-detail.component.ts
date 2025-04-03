import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../../../core/services/article.service';
import { CommentService } from '../../../core/services/comment.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Comment } from '../../../core/interfaces/comment.interface';
import { Article } from '../../../core/interfaces/article.interface';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss']
})
export class ArticleDetailComponent implements OnInit {
  article!: Article;
  articleId!: number;
  comments: Comment[] = [];
  commentForm: FormGroup;
  commentMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private commentService: CommentService,
    private fb: FormBuilder,
    private location: Location,
    private router: Router
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
    this.articleService.getArticleById(this.articleId).subscribe({
      next: (data) => {
        if (!data) {
          this.router.navigate(['/not-found']);
        } else {
          this.article = data;
        }
      },
      error: () => {
        this.router.navigate(['/not-found']);
      }
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
          this.loadComments();
          setTimeout(() => {
            this.commentMessage = '';
          }, 2000);
        },
        error: (error) => {
          this.commentMessage = error.error ? error.error : 'Erreur lors de l\'ajout du commentaire';
          setTimeout(() => {
            this.commentMessage = '';
          }, 2000);
        }
      });
    }
  }
  

  goBack(): void {
    this.location.back();
  }
}
