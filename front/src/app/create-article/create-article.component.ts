import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArticleService } from '../services/article.service';
import { TopicService } from '../services/topic.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; // Pour revenir en arrière

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.scss']
})
export class CreateArticleComponent implements OnInit {
  articleForm: FormGroup;
  message: string = '';
  topics: any[] = [];

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private topicService: TopicService,
    private router: Router,
    private location: Location // Injection du service Location pour la navigation arrière
  ) {
    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      topicId: ['', Validators.required] // Sélection du topic (ID)
    });
  }

  ngOnInit(): void {
    this.loadTopics();
  }

  loadTopics(): void {
    this.topicService.getTopics().subscribe({
      next: (data) => {
        this.topics = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des topics', err);
      }
    });
  }

  onSubmit(): void {
    if (this.articleForm.valid) {
      this.articleService.createArticle(this.articleForm.value).subscribe({
        next: (response) => {
          this.message = response.message || 'Article créé avec succès';
          this.articleForm.reset();
          setTimeout(() => this.router.navigate(['/article']), 1500);
        },
        error: (error) => {
          this.message = error.error ? error.error : 'Erreur lors de la création de l\'article';
        }
      });
    }
  }

  // Retour en arrière
  goBack(): void {
    this.location.back(); // Utilise le service Location pour revenir à la page précédente
  }
}
