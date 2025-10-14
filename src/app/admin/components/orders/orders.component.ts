import { Component } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-orders',
  standalone: false,
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {
  orders: any[] = [];
  showSidebar = false;
  reservations: any[] = [];
displayedColumns: string[] = ['trackingId','nomService', 'userName', 'reservationDescription', 'adresse', 'date', 'orderStatus', 'action'];
searchProdUserName: string = '';
searchEventsUserName: string = '';
reservationsProd: any[] = [];


  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }
  constructor(
    private adminService: AdminService,
    private snackbar: MatSnackBar,
    private authService:AuthService
  ) {}
  searchReservationsProdByUserName() {
    if (!this.searchProdUserName.trim()) {
      this.getPlacedOrders();
      return;
    }
  
    this.adminService.searchReservationsProdByUserName(this.searchProdUserName.trim()).subscribe({
      next: (res) => this.orders = res,
      error: () => this.snackbar.open('Erreur recherche commandes', 'Fermer', { duration: 3000 })
    });
  }
  
  searchReservationsByUserName() {
    if (!this.searchEventsUserName.trim()) {
      this.loadReservations();
      return;
    }
  
    this.adminService.searchReservationsByUserName(this.searchEventsUserName.trim()).subscribe({
      next: (res) => this.reservations = res,
      error: () => this.snackbar.open('Erreur recherche réservations', 'Fermer', { duration: 3000 })
    });
  }
  ngOnInit() {
    this.getPlacedOrders();
    this.loadReservations();

  }

  getPlacedOrders() {
    this.adminService.getPlacedOrders().subscribe(res => {
      console.log('Commandes récupérées :', res);
      this.orders = res;
    });
  }
  loadReservations(): void {
    this.adminService.getAllReservations().subscribe({
      next: (res) => this.reservations = res,
      error: () => this.snackbar.open('Erreur chargement réservations', 'Fermer', { duration: 3000 })
    });
  }

  
  changeOrderStatus(reservationId: number, status: string): void {
    this.adminService.changeOrderStatus(reservationId, status).subscribe({
      next: () => {
        this.snackbar.open('✅ Statut mis à jour avec succès', 'Fermer', { duration: 3000 });
        this.getPlacedOrders(); // rafraîchir les données
      },
      error: () => {
        this.snackbar.open('❌ Erreur lors du changement de statut', 'Fermer', { duration: 3000 });
      }
    });
  }
  changeStatus(reservationId: number, status: string): void {
    this.adminService.changeReservationEventStatus(reservationId, status).subscribe({
      next: () => {
        this.snackbar.open('✅ Statut mis à jour avec succès', 'Fermer', { duration: 3000 });
        this.loadReservations();
      },
      error: () => {
        this.snackbar.open('❌ Erreur lors du changement de statut', 'Fermer', { duration: 3000 });
      }
    });
  }
  
  
  // deleteOrder(orderId: number) {
  //   this.adminService.deleteOrder(orderId).subscribe({
  //     next: (response) => {
  //       const message = response?.message || 'Commande supprimée';
  //       this.snackbar.open(message, 'Fermer', { duration: 5000 });
  //       this.getPlacedOrders();
  //     },
  //     error: (err) => {
  //       const errorMsg = err.error?.error || err.error?.message || 'Erreur de suppression';
  //       this.snackbar.open(errorMsg, 'Fermer', { duration: 5000 });
  //     }
  //   });
  // }
}
