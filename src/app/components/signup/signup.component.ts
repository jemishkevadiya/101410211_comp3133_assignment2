import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <mat-card class="fade-in">
      <mat-card-header>
        <mat-card-title>Signup for EMS</mat-card-title>
        <mat-card-subtitle>Create a new account</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline">
            <mat-label>Username</mat-label>
            <input matInput formControlName="username" placeholder="Username" />
            <mat-error *ngIf="signupForm.get('username')?.hasError('required')">
              Username is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" placeholder="Email" type="email" />
            <mat-error *ngIf="signupForm.get('email')?.hasError('required')">
              Email is required
            </mat-error>
            <mat-error *ngIf="signupForm.get('email')?.hasError('email')">
              Invalid email format
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Password</mat-label>
            <input matInput formControlName="password" placeholder="Password" type="password" />
            <mat-error *ngIf="signupForm.get('password')?.hasError('required')">
              Password is required
            </mat-error>
          </mat-form-field>

          <mat-card-actions>
            <button mat-raised-button color="primary" type="submit" [disabled]="signupForm.invalid">
              Signup
            </button>
          </mat-card-actions>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    mat-card {
      max-width: 500px;
      margin: 50px auto;
      padding: 30px;
    }
    mat-card-header {
      text-align: center;
      margin-bottom: 30px;
    }
    mat-card-title {
      font-size: 1.5rem;
    }
    mat-card-subtitle {
      color: #888;
    }
    mat-form-field {
      width: 100%;
      margin-bottom: 20px;
    }
    button[mat-raised-button] {
      background: #808000; /* Olive green */
      color: white;
      width: 100%;
    }
  `],
})
export class SignupComponent {
  signupForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    const { username, email, password } = this.signupForm.value;
    this.authService.signup(username!, email!, password!).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => console.error(err),
    });
  }
}