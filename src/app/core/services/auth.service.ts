import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

export interface LoginResponse {
  token: string;
  expiresAt: string;
  role: string; 
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private USER_KEY = 'user';
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { username: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials);
  }

  setCurrentUser(user: LoginResponse) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getCurrentUser(): LoginResponse | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  getUserRole(): string {
    return this.getCurrentUser()?.role || '';
  }

  getToken(): string | null {
    return this.getCurrentUser()?.token || null;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  logout() {
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/login']);
  }
}
