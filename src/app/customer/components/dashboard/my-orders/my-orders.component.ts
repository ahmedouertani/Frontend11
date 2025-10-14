import { Component } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-orders',
  standalone: false,
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.css',
})
export class MyOrdersComponent {
  productOrders: any[] = [];
  eventOrders: any[] = [];
  isLoading = false;
  isLoadingEvents = false;
  deletingOrderId: number | null = null;
  displayedProductColumns: string[] = ['trackingId', 'nomService', 'description', 'adresse', 'date', 'status', 'action'];
  displayedEventColumns: string[] = ['nomService', 'description', 'adresse', 'date', 'status', 'action'];
  
  constructor(
    private customerService: CustomerService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAllOrders();
  }

  loadAllOrders() {
    this.getMyProductOrders();
    this.getMyEventOrders();
  }
  
  getStatusClass(status: string): string {
    if (!status) return '';
    switch(status.toUpperCase()) {
      case 'ACCEPTER': return 'status-accepted';
      case 'EN_COURS': return 'status-pending';
      case 'REFUSER': return 'status-rejected';
      case 'EN_ATTENTE': return 'status-waiting';
      case 'TERMINE': return 'status-completed';
      default: return '';
    }
  }

  getMyProductOrders() {
    this.isLoading = true;
    this.customerService.getOrdersByUserId().subscribe({
      next: (res) => {
        this.productOrders = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading product orders:', err);
        this.isLoading = false;
        this.showError('Failed to load product orders');
      }
    });
  }
  
  getMyEventOrders() {
    this.isLoadingEvents = true;
    this.customerService.getEventReservationsByUser().subscribe({
      next: (res) => {
        this.eventOrders = res;
        this.isLoadingEvents = false;
      },
      error: (err) => {
        console.error('Error loading event orders:', err);
        this.isLoadingEvents = false;
        this.showError('Failed to load event reservations');
      }
    });
  }

  deleteProductOrder(reservationId: number, event: Event): void {
    event.stopPropagation();
    const userId = this.authService.getUserId();
    this.deletingOrderId = reservationId;
    this.customerService.deleteOrder(reservationId, userId).subscribe({
      next: () => {
        this.snackBar.open('Product order deleted successfully', 'Close', { duration: 3000 });
        this.getMyProductOrders();
      },
      error: (err) => {
        console.error('Delete error:', err);
        this.showError(err.error?.message || 'Failed to delete product order');
      },
      complete: () => {
        this.deletingOrderId = null;
      }
    });
  }

  deleteEventOrder(reservationId: number, event: Event): void {
    event.stopPropagation();
    const userId = this.authService.getUserId();
    this.deletingOrderId = reservationId;
    this.customerService.deleteReservationEvent(reservationId, userId).subscribe({
      next: (response: any) => {
        const message = response.message || 'Event reservation deleted successfully';
        this.snackBar.open(message, 'Close', { duration: 3000 });
        this.getMyEventOrders();
      },
      error: (err) => {
        console.error('Delete error:', err);
        this.showError(err.error?.message || 'Failed to delete event reservation');
      },
      complete: () => {
        this.deletingOrderId = null;
      }
    });
  }

  onRowClick(row: any, type: 'product' | 'event'): void {
    if (type === 'product') {
      this.router.navigate(['/customer/order-details', row.id]);
    } else {
      this.router.navigate(['/customer/event-details', row.id]);
    }
  }

  writeReview(order: any, type: 'product' | 'event', event: Event): void {
    event.stopPropagation();
    if (type === 'product') {
      this.router.navigate(['/customer/review'], { 
        queryParams: { reservationProdId: order.id } 
      });
    } else {
      this.router.navigate(['/customer/review'], { 
        queryParams: { reservationEventId: order.id } 
      });
    }
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}