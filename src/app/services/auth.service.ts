import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private apiUrl = 'https://comp3133-101410211-assignment1.onrender.com/graphql';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object 
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.tokenSubject.next(localStorage.getItem('token'));
    }
  }

  login(email: string, password: string): Observable<any> {
    const query = `
      query Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
          user {
            id
            username
            email
          }
        }
      }
    `;
    return this.http
      .post(
        this.apiUrl,
        { query, variables: { email, password } },
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
      )
      .pipe(
        map((response: any) => {
          const token = response.data.login.token;
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', token);
          }
          this.tokenSubject.next(token);
          return response.data.login;
        })
      );
  }

  signup(username: string, email: string, password: string): Observable<any> {
    const mutation = `
      mutation Signup($username: String!, $email: String!, $password: String!) {
        signup(username: $username, email: $email, password: $password) {
          id
          username
          email
        }
      }
    `;
    return this.http
      .post(
        this.apiUrl,
        { query: mutation, variables: { username, email, password } },
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
      )
      .pipe(map((response: any) => response.data.signup));
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.tokenSubject.next(null);
  }

  getToken() {
    return this.tokenSubject.asObservable();
  }

  isAuthenticated() {
    return !!this.tokenSubject.value;
  }
}