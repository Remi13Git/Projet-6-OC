import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
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
      this.authService.authenticate(this.loginForm.value).subscribe({
        next: (result) => {
          if (result.success) {
            this.message = result.message;
            // Redirection après la connexion
            this.router.navigate(['/article']);
          } else {
            this.message = result.message; // Affiche le message d'erreur
          }
        },
        error: (error) => {
          console.error('Erreur lors de la connexion :', error);
          this.message = 'Erreur inconnue';
        }
      });
    }
  }

  // Méthode pour revenir à la page précédente
  goBack(): void {
    this.router.navigate(['..']);
  }
}
