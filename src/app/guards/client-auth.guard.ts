import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserStorageService } from '../services/storage/user-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ClientAuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private userStorage: UserStorageService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const user = UserStorageService.getUser();

    if (user && user.role === 'CLIENT') {
      return true; // ✅ accès autorisé
    } else {
      // ❌ redirection vers login + returnUrl
      this.router.navigate(['/logins'], {
        queryParams: { returnUrl: state.url }
      });
      return false;
    }
  }
}
