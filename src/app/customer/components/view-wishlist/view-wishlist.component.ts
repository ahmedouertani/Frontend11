import { Component } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserStorageService } from '../../../services/storage/user-storage.service';

@Component({
  selector: 'app-view-wishlist',
  standalone: false,
  templateUrl: './view-wishlist.component.html',
  styleUrl: './view-wishlist.component.css'
})
export class ViewWishlistComponent {
  services: any[] = [];

  constructor(
    private customerService: CustomerService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getWishListByUserId();
  }

  getWishListByUserId(): void {
    this.customerService.getWishListByUserId().subscribe(res => {
      this.services = res.map((element: any) => ({
        wishlistId: element.id,
        serviceName: element.serviceName,
        serviceDescription: element.serviceDescription,
        processedImg: "data:image/jpeg;base64," + element.returnedImg
      }));
    });
  }

  deleteWishlist(wishlistId: number): void {
    const userId = +UserStorageService.getUserId();

    this.customerService.deleteWishlist(wishlistId,userId).subscribe({
      next: (message: string) => {
        this.snackbar.open(message, 'Fermer', { duration: 3000 });
        this.services = this.services.filter(item => item.wishlistId !== wishlistId);
      },
      error: (error) => {
        let message = 'Erreur lors de la suppression';
        if (typeof error === 'string') {
          message = error;
        } else if (error?.error && typeof error.error === 'string') {
          message = error.error;
        }
        this.snackbar.open(message, 'Fermer', { duration: 4000 });
      }
    });
  }
}