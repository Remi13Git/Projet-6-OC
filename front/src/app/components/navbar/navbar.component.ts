import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  shouldDisplayNavItems: boolean = true;
  shouldDisplayNavbar: boolean = true;
  activeRoute: string = '';  // Stocke la route active

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.activeRoute = event.urlAfterRedirects; // Récupère la route active
      this.updateNavbarDisplay();
      this.updateNavItemsDisplay();
    });

    this.updateNavbarDisplay();
    this.updateNavItemsDisplay();
  }

  updateNavbarDisplay(): void {
    const currentRoute = this.router.url;
    this.shouldDisplayNavbar = currentRoute !== '/';
  }

  updateNavItemsDisplay(): void {
    const currentRoute = this.router.url;
    this.shouldDisplayNavItems = !(currentRoute === '/login' || currentRoute === '/register');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
