import { Injectable } from '@angular/core';

const TOKEN = 'ecom-token';
const USER = 'ecom-user';

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {

  constructor() { }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  public saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.setItem(TOKEN, token);
  }
  
  public saveUser(user): void {
    window.localStorage.removeItem(USER);
    window.localStorage.setItem(USER, JSON.stringify(user));
  }
  

  static getToken(): string {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(TOKEN);
    }
    return null; // Retourne null si l'accès à localStorage échoue
  }
  static getUser() {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem(USER);
          return userStr ? JSON.parse(userStr) : null;
    }
    return null;
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
      return ''; // Retourne une chaîne vide si l'utilisateur n'est pas trouvé
    }
    return user.role;
  }
  

  static isAdminLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const user = this.getUser();
    if (user === null) {
      console.log('Aucun utilisateur trouvé');
      return false;
    }
    console.log('Rôle utilisateur (admin):', user.role);  // Log du rôle de l'utilisateur
    return user.role === 'ADMIN';
  }
  
  static isCustomerLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const user = this.getUser();
    if (user ===null) {
      console.log('Aucun utilisateur trouvé');
      return false;
    }
    console.log('Rôle utilisateur (client):', user.role);  // Log du rôle de l'utilisateur
    return user.role === 'CLIENT';
  }
  

  static signOut(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(TOKEN);
      window.localStorage.removeItem(USER);
      
    }
  }


  static isPrestataireLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const user = this.getUser();
    if (!user) return false;
    console.log('Rôle utilisateur (prestataire) :', user.role);
    return user.role === 'PRESTATAIRE';
  }
  
}
