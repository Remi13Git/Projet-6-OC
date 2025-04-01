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
    if (this.loginForm.valid) {
        this.authService.login(this.loginForm.value).subscribe({
            next: (response) => {
                // Stocke le token dans le localStorage après une connexion réussie
                if (response?.token) {
                    localStorage.setItem('authToken', response.token); // Stocke le token
                    this.message = response?.message || 'Connexion réussie';
                } else {
                    this.message = 'Erreur, aucun token reçu';
                }
                // Redirection après la connexion
                this.router.navigate(['/article']);
            },
            error: (error) => {
                console.error('Erreur lors de la connexion :', error);
                // Gérer l'erreur
                if (error.status === 403) {
                    this.message = 'Accès refusé, veuillez vérifier vos identifiants';
                } else {
                    this.message = error?.error?.message || 'Erreur lors de la connexion';
                }
            }
        });
    }
  }

  // Méthode pour revenir à la page précédente
  goBack(): void {
    this.router.navigate(['..']);
  }
}
