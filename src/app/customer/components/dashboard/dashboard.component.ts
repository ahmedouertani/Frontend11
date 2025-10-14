import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../../services/customer.service';
import { HttpClient } from '@angular/common/http';
import { UserStorageService } from '../../../services/storage/user-storage.service';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login-dialog',
  template: `
    <mat-card>
      <mat-card-title>Authentification requise</mat-card-title>
      <mat-card-content>
        <p>{{ data.message }}</p>
        <div style="text-align: right; margin-top: 15px;">
          <button mat-button color="primary" (click)="onLogin()">{{ data.loginText }}</button>
          <button mat-button (click)="onCancel()">{{ data.cancelText }}</button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  standalone: true,
  imports: [MatCardModule, MatButtonModule]
})
export class LoginDialogTemplate {
  constructor(
    public dialogRef: MatDialogRef<LoginDialogTemplate>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) {}

  onLogin(): void {
    this.dialogRef.close(true);
    this.router.navigate(['/login']);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}

@Component({
  selector: 'app-dashboard',
  standalone:false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  services: any[] = [];
  searchProductForm!: FormGroup;
  images: any[] = [];
  wishlistServiceIds: number[] = [];
  floatingButtonVisible: boolean = false;
  selectedServiceId: number | null = null;
  userId = Number(UserStorageService.getUserId());

  rendezvousList: any[] = [];
  selectedRendezvousId: number | null = null;

  constructor(
    private customerService: CustomerService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllProducts();
    this.searchProductForm = this.fb.group({
      title: [null, Validators.required]
    });

    if (this.userId) {
      this.customerService.getWishListByUserId().subscribe({
        next: (res) => {
          this.wishlistServiceIds = res.map((w: any) => w.serviceId);
        }
      });

      this.loadMesRendezVous();
    }
  }

  getAllProducts() {
    this.services = [];
    this.customerService.getAllProducts().subscribe({
      next: (res) => {
        this.services = res.map(element => ({
          ...element,
          processedImg: 'data:image/jpeg;base64,' + element.byteImg
        }));
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des produits:', err);
        this.snackbar.open('Erreur lors de la récupération des produits', 'Fermer', { duration: 5000 });
      }
    });
  }

  submitForm() {
    this.services = [];
    const title = this.searchProductForm.get('title')!.value;
    this.customerService.getAllProductByName(title).subscribe(res => {
      this.services = res.map(element => ({
        ...element,
        processedImg: 'data:image/jpeg;base64,' + element.byteImg
      }));
    });
  }

  isInWishlist(serviceId: number): boolean {
    return this.wishlistServiceIds.includes(serviceId);
  }

  // addToCart(id: number): void {
  //   this.customerService.addToCart(id).subscribe(
  //     () => {
  //       this.snackbar.open('Produit ajouté au panier avec succès', 'Fermer', { duration: 3000 });
  //     },
  //     () => {
  //       this.snackbar.open('Erreur lors de l\'ajout au panier', 'Fermer', { duration: 3000 });
  //     }
  //   );
  // }

  addToWishList(serviceId: number) {
    if (!this.userId) {
      const dialogRef = this.dialog.open(LoginDialogTemplate, {
        width: '400px',
        disableClose: true,
        data: {
          message: '🔒 Connectez-vous pour ajouter aux favoris',
          loginText: 'Se connecter',
          cancelText: 'Annuler'
        }
      });

      dialogRef.afterClosed().subscribe((shouldRetry: boolean) => {
        if (shouldRetry && UserStorageService.getUserId()) {
          this.addToWishList(serviceId);
        }
      });
      return;
    }

    const wishlistDto = { serviceId, userId: this.userId };
    this.customerService.addProductToWishlist(wishlistDto).subscribe({
      next: (res) => {
        if (res?.id != null) {
          this.wishlistServiceIds.push(serviceId);
          this.snackbar.open('Ajouté aux favoris avec succès !', 'Fermer', { duration: 5000 });
        } else {
          this.snackbar.open('Déjà présent dans les favoris.', 'Erreur', { duration: 5000 });
        }
      },
      error: () => {
        this.snackbar.open('Erreur lors de l’ajout aux favoris.', 'Erreur', { duration: 5000 });
      }
    });
  }

  loadMesRendezVous() {
    this.customerService.getMesRendezVous(this.userId).subscribe({
      next: (res) => {
        this.rendezvousList = res;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des rendez-vous:', err);
      }
    });
  }

  finaliserReservation(): void {
    if (this.selectedServiceId != null) {
      this.router.navigate(['/customer/reserver-event', this.selectedServiceId]);
    }
  }

  goToFinalForm(): void {
    this.router.navigate(['/customer/place-order-events']);
  }

  onInscrireClient() {
    this.http.post(`http://localhost:8081/api/newsletter/client/${this.userId}`, {}, { responseType: 'text' })
      .subscribe({
        next: () => {
          this.snackbar.open('✅ Vous êtes inscrit à la newsletter', 'Fermer', { duration: 3000 });
        },
        error: (err) => {
          const msg = err.status === 400 ? err.error : '❌ Erreur d\'inscription';
          this.snackbar.open(msg, 'Fermer', { duration: 4000 });
        }
      });
  }

  onModifierRendezVous(rendezvousId: number) {
    this.selectedRendezvousId = rendezvousId;
    this.router.navigate(['/customer/modifier-rendezvous', rendezvousId]);
  }
  logout(): void {
    UserStorageService.signOut();
    this.router.navigate(['/login'], { replaceUrl: true }).then(() => {
      window.location.reload();
    });
  }

}
