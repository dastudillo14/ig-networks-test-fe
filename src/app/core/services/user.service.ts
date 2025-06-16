import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { LoginCredentialsI, RegisterUserI, UserLoginI } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { ProfileEnum } from '../enums/profile.enum';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.API_URL + '/user';
  private currentUserSubject = new BehaviorSubject<UserLoginI | null>(this.getStoredUser());
  currentUser$ = this.currentUserSubject.asObservable();

  private http = inject(HttpClient);
  private router = inject(Router);
  constructor() {}

  private getStoredUser(): UserLoginI | null {
    try {
      const savedUser = localStorage.getItem('currentUser');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      localStorage.removeItem('currentUser');
      return null;
    }
  }

  login(credentials: LoginCredentialsI): Observable<UserLoginI> {
    return this.http.post<UserLoginI>(`${this.apiUrl}/login`, credentials).pipe(
      tap(user => {
        this.setCurrentUser(user);
      })
    );
  }

  register(data: RegisterUserI): Observable<UserLoginI> {
    return this.http.post<UserLoginI>(`${this.apiUrl}/register`, data).pipe(
      tap(user => {
        this.setCurrentUser(user);
      })
    );
  }

  private setCurrentUser(user: UserLoginI): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/auth/login']);
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): UserLoginI | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.user.groups.some((group: any) => group === ProfileEnum.ADMIN) ?? false;
  }

  isApplicant(): boolean {
    const user = this.getCurrentUser();
    return user?.user.groups.some((group: any) => group === ProfileEnum.APPLICANT) ?? false;
  }
} 