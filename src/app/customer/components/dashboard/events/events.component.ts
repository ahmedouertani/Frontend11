import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';
import { UserStorageService } from '../../../../services/storage/user-storage.service';
import { ReservationEventService } from '../../../../services/reservation-event.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginsComponent } from '../../../../logins/logins.component';

@Component({
  selector: 'app-events',
  standalone: false,
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  services: any[] = [];
  categories: string[] = [];
  selectedCategory: string | null = null;
  filteredServices: any[] = [];
  showFinalizeButton: boolean = false;

  constructor(
    private customerService: CustomerService,
    private reservationService: ReservationEventService,
    private snackbar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts() {
    this.customerService.getAllProducts().subscribe({
      next: (res) => {
        const all = res.filter(service => service.afficherDans === 'events')
          .map(service => ({
            ...service,
            processedImg: 'data:image/jpeg;base64,' + service.byteImg
          }));

        this.categories = Array.from(new Set(all.map(s => s.categoryName))) as string[];
        this.services = all;

        if (this.categories.length > 0) {
          this.selectCategory(this.categories[0]);
        }
      }
    });
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.filteredServices = this.services.filter(s => s.categoryName === category);
  }

  reserver(serviceId: number): void {
    const isLoggedIn = !!UserStorageService.getToken();

    if (!isLoggedIn) {
      const dialogRef = this.dialog.open(LoginsComponent, {
        width: '400px',
        height: '500px',

        data: { serviceId }
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          this.reserver(serviceId);
        }
      });

      return;
    }

    const userId = Number(UserStorageService.getUserId());
    if (!userId || !serviceId) {
      this.snackbar.open('Utilisateur ou service non défini ❌', 'Fermer', { duration: 3000 });
      return;
      
    }
    this.router.navigate(['customer/place-order-events']);

    this.reservationService.ajouterDemande(userId, serviceId).subscribe({
      next: () => {
        this.snackbar.open('Produit Ajouté au réservérvations  ✅', 'Fermer', { duration: 2000 });
        this.showFinalizeButton = true;
      },
      error: err => {
        this.snackbar.open('Erreur lors de la réservation ❌', 'Fermer', { duration: 3000 });
        console.error(err);
      }
    });
  }

  goToPlaceOrder() {
    this.router.navigate(['customer/place-order-events']);
  }

    goToDetail(id: number, type: 'prod' | 'event') {
      if (type === 'event') {
        this.router.navigate(['customer/event', id]);
      } else {
        this.router.navigate(['customer/service', id], { queryParams: { type } });
      }
    }
}
