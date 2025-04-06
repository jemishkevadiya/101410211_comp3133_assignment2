import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule],
  template: `
    <mat-toolbar class="navbar">
      <span>Employee Management System</span>
      <span class="spacer"></span>
      <button mat-raised-button color="accent" (click)="logout()">
        Logout
      </button>
    </mat-toolbar>
  `,
  styles: [`
    .navbar {
      background: #f9f9f9;
      padding: 0 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    span {
      font-size: 1.2rem;
      font-weight: 500;
      color: #6e48aa;
    }
    .spacer {
      flex: 1 1 auto;
    }
    button[mat-raised-button] {
      background: #6e48aa; /* Olive green */
      color: white;
    }
  `],
})
export class NavbarComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}