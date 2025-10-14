// guards/prestataire-auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserStorageService } from '../services/storage/user-storage.service';

@Injectable({
  providedIn: 'root'
})
export class PrestataireAuthGuard implements CanActivate {
  constructor(private userStorage: UserStorageService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = UserStorageService.getUser();
    if (user && user.role === 'PRESTATAIRE') {
      return true;
    } else {
      this.router.navigate(['/logins'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}
