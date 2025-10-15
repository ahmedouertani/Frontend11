import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const TOKEN = 'ecom-token';
const USER = 'ecom-user';

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {
  private static platformId: any;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    UserStorageService.platformId = platformId;
  }

  private static isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  public saveToken(token: string): void {
    if (!UserStorageService.isBrowser()) return;
    window.localStorage.removeItem(TOKEN);
    window.localStorage.setItem(TOKEN, token);
  }

  public saveUser(user: any): void {
    if (!UserStorageService.isBrowser()) return;
    window.localStorage.removeItem(USER);
    window.localStorage.setItem(USER, JSON.stringify(user));
  }


  static getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(TOKEN);
  }

  static getUser(): any {
    if (!this.isBrowser()) return null;
    const userStr = localStorage.getItem(USER);
    return userStr ? JSON.parse(userStr) : null;
  }

  static getUserId(): string {
    const user = this.getUser();
    if (user == null) {
      return '';
    }
    return user.userId;
  }

  static getUserRole(): string {
    const user = this.getUser();
    if (!user) {
      return '';
    }
    return user.role;
  }


  static isAdminLoggedIn(): boolean {
    if (!this.isBrowser()) return false;
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const user = this.getUser();
    if (user === null) {
      return false;
    }
    return user.role === 'ADMIN';
  }

  static isCustomerLoggedIn(): boolean {
    if (!this.isBrowser()) return false;
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const user = this.getUser();
    if (user === null) {
      return false;
    }
    return user.role === 'CLIENT';
  }


  static signOut(): void {
    if (!this.isBrowser()) return;
    window.localStorage.removeItem(TOKEN);
    window.localStorage.removeItem(USER);
  }


  static isPrestataireLoggedIn(): boolean {
    if (!this.isBrowser()) return false;
    const token = this.getToken();
    if (!token) return false;
    const user = this.getUser();
    if (!user) return false;
    return user.role === 'PRESTATAIRE';
  }

}
