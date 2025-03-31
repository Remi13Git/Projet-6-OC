import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  message: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      identifier: ['', Validators.required], // email ou username
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    console.log('Formulaire soumis', this.loginForm.value); // Vérifie si la soumission du formulaire est bien déclenchée
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Réponse de connexion :', response); // Vérifie la réponse du backend
          // Si la réponse est un objet contenant un message
          this.message = response?.message || 'Connexion réussie'; // Affiche le message de succès
          // Redirection vers la page d'accueil après une connexion réussie
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Erreur lors de la connexion :', error); // Log de l'erreur
          this.message = error?.error || 'Erreur lors de la connexion';
        }
      });
    }
  }
}
