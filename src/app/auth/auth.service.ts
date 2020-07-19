import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import AuthData from './auth-data.model'
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.api_url + "/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private userAuthenticated = new Subject<boolean>();
  private isUserLoggedIn = false;
  private tokenExpirationTime: number;
  private tokenTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  getToken(): string {
    return this.token;
  }
  createUser(email: string, password: string) {
    const authdata: AuthData = {
      email: email,
      password: password
    }
    this.http.post(BACKEND_URL + "/signUp", authdata)
      .subscribe(() => {
        this.router.navigate(['/login']);
      }, error => {
        this.userAuthenticated.next(false);
      })

  }

  getUserAuthenticationStatus() {
    return this.userAuthenticated.asObservable();
  }
  getUserLoggedIn() {
    return this.isUserLoggedIn;
  }

  login(email: string, password: string) {
    const authdata: AuthData = {
      email: email,
      password: password
    }
    this.http.post<{ token: string, expiresIn: number }>(BACKEND_URL+"/login", authdata)
      .subscribe(res => {
        const token = res.token;
        this.token = token;
        if (token) {
          this.isUserLoggedIn = true;
          this.tokenExpirationTime = res.expiresIn;
          this.setTokenTimer(this.tokenExpirationTime);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + this.tokenExpirationTime * 1000);
          this.setAuthToken(this.token, expirationDate);
          this.userAuthenticated.next(true);
          this.router.navigate(['/']);
        }
      },
        err => {
          this.userAuthenticated.next(false);
          console.log(err.message);
        })
  }

  setTokenTimer(duration) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  autoAuthorization() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const isInFuture = authInformation.expiration.getTime() - now.getTime();
    if (isInFuture > 0) {
      this.isUserLoggedIn = true;
      this.token = authInformation.token;

      this.setTokenTimer(isInFuture/1000);
      this.userAuthenticated.next(true);


    }
  }

  logout() {
    this.token = null;
    this.isUserLoggedIn = false;
    this.userAuthenticated.next(false);
    clearTimeout(this.tokenTimer);
    this.removeAuthToken();
    this.router.navigate(['/login']);
  }

  setAuthToken(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  removeAuthToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  getAuthData() {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expiration');
    if (!token || !expiration) {
      return;
    }
    return {
      token: token,
      expiration: new Date(expiration)
    }
  }
}
