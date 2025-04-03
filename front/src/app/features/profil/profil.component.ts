import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../core/services/profile.service';
import { Topic } from '../../core/interfaces/topic.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  profileForm: FormGroup;
  message: string = '';
  passwordMessage: string = ''; // Message spécifique au mot de passe
  subscribedTopics: Topic[] = []; // Liste des thèmes abonnés

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private profileService: ProfileService) {
    // Ajouter la validation du mot de passe
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [ // Validation du mot de passe
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]]
    });

    // Surveillance de l'input du mot de passe
    this.profileForm.get('password')?.valueChanges.subscribe(value => {
      if (value && value.length > 0) {
        this.passwordMessage = "Le nouveau mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.";
      } else {
        this.passwordMessage = '';
      }
    });
  }

  ngOnInit(): void {
    this.loadProfile();
    this.loadSubscribedTopics();
  }

  loadProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (response) => {
        // Remplir le formulaire avec les informations récupérées
        this.profileForm.patchValue({
          email: response.email,
          username: response.username
        });
      },
      error: (error) => {
        this.message = error.error ? error.error : 'Erreur lors du chargement du profil';
      }
    });
  }

  loadSubscribedTopics(): void {
    this.profileService.getSubscribedTopics().subscribe({
      next: (response) => {
        this.subscribedTopics = response;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des abonnements', error);
      }
    });
  }

  unsubscribe(topicId: number): void {
    this.profileService.unsubscribeFromTopic(topicId).subscribe({
      next: () => {
        // Mettre à jour la liste des abonnements après désinscription
        this.subscribedTopics = this.subscribedTopics.filter(topic => topic.id !== topicId);
      },
      error: (error) => {
        console.error('Erreur lors du désabonnement', error);
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.profileService.updateProfile(this.profileForm.value).subscribe({
        next: (response) => {
          this.message = response.message || 'Profil mis à jour avec succès';
          // Attendre 1,5 secondes avant de rediriger vers /article
          setTimeout(() => {
            this.router.navigate(['/article']); // Redirection après le délai
          }, 1500);
        },
        error: (error) => {
          this.message = error.error ? error.error : 'Erreur lors de la mise à jour du profil';
        }
      });
    } else {
      this.message = "Le nouveau mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.";
    }
  }
}
