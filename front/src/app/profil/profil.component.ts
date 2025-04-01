import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  profileForm: FormGroup;
  message: string = '';
  subscribedTopics: any[] = []; // Liste des thèmes abonnés

  constructor(private fb: FormBuilder, private profileService: ProfileService) {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: [''] // Optionnel : laisser vide si le mot de passe ne change pas
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
          // Rechargez le profil et les abonnements après une mise à jour, si nécessaire
          this.loadProfile();
          this.loadSubscribedTopics();
        },
        error: (error) => {
          this.message = error.error ? error.error : 'Erreur lors de la mise à jour du profil';
        }
      });
    }
  }
}
