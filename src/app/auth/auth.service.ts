import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { LOGIN } from '../shared/graphql/queries';
import { SIGNUP } from '../shared/graphql/mutation';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private apollo: Apollo,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  login(email: string, password: string) {
    return this.apollo
      .query({
        query: LOGIN,
        variables: { email, password }
      })
      .pipe(
        map((result: any) => {
          const { token, user } = result.data.login;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
          return user;
        })
      );
  }

  signup(username: string, email: string, password: string) {
    return this.apollo
      .mutate({
        mutation: SIGNUP,
        variables: { username, email, password }
      })
      .pipe(
        map((result: any) => {
          this.snackBar.open('Signup successful! Please login.', 'Close', { duration: 3000 });
          return result.data.signup;
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.snackBar.open('Logged out successfully!', 'Close', { duration: 3000 });
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
}