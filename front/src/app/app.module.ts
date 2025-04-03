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
import { HomeComponent } from './features/home/home.component';
import { RegisterComponent } from './features/register/register.component';
import { LoginComponent } from './features/login/login.component';
import { ProfilComponent } from './features/profil/profil.component';
import { ArticleComponent } from './features/articles/article/article.component';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { TopicsComponent } from './features/topics/topics.component';
import { CreateArticleComponent } from './features/articles/article-create/create-article.component';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { ArticleDetailComponent } from './features/articles/article-detail/article-detail.component';
import { CustomButtonComponent } from './core/components/custom-button/custom-button.component';
import { NotFoundComponent } from './features/not-found/not-found.component';

@NgModule({
  declarations: [AppComponent, ArticleComponent, RegisterComponent, LoginComponent, ProfilComponent, TopicsComponent, CreateArticleComponent, NavbarComponent, ArticleDetailComponent, HomeComponent, CustomButtonComponent, NotFoundComponent],
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
