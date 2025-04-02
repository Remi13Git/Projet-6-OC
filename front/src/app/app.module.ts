import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ProfilComponent } from './profil/profil.component';
import { ArticleComponent } from './pages/article/article.component';
import { JwtInterceptor } from './services/JwtInterceptor';
import { AuthInterceptor } from './services/auth.interceptor';
import { TopicsComponent } from './topics/topics.component';
import { CreateArticleComponent } from './create-article/create-article.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { CustomButtonComponent } from './shared/custom-button/custom-button.component';

@NgModule({
  declarations: [AppComponent, ArticleComponent, RegisterComponent, LoginComponent, ProfilComponent, TopicsComponent, CreateArticleComponent, NavbarComponent, ArticleDetailComponent, HomeComponent, CustomButtonComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    HttpClientModule,

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
