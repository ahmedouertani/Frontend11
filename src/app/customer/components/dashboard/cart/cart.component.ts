import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { error } from 'console';
import { PlaceOrderComponent } from '../place-order/place-order.component';
import { UserStorageService } from '../../../../services/storage/user-storage.service';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  demandes: any[] = [];
  order: any;
  coponForm!:FormGroup;

  constructor(
    private customerService: CustomerService,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
this.coponForm=this.fb.group({
  code:[null,[Validators.required]]
})

    this.getCart();
    this.customerService.updateDemandeCount();

  }

  applyCopon() {
    const code = this.coponForm.get('code')!.value;
    this.customerService.applyCopon(code).subscribe({
      next: (res) => {
        this.snackbar.open("Copon appliqué avec succès ✅", "Fermer", { duration: 4000 });
        this.getCart(); // Recharge le panier avec les prix actualisés
      },
      error: (err) => {
        this.snackbar.open(err.error || "Erreur lors de l'application du copon", "Fermer", { duration: 4000 });
      }
    });
  }
  
  // Récupère les articles du panier
  getCart() {
    this.customerService.getCartByUserId().subscribe({
      next: res => {
        this.demandes = res.map(element => ({
          ...element,
          processedImg: 'data:image/jpeg;base64,' + element.returnedImg
        }));
      },
      error: err => {
        this.demandes = []; // ✅ remet à zéro l'affichage si erreur
        console.error("Erreur chargement du panier :", err);
      }
    });
  }
  
  
  // increaseQuantity(productId: any) {
  //   this.customerService.increaseProductQuantity(productId).subscribe(
  //     res => {
  //       this.snackbar.open('Quantité augmentée', 'Fermer', { duration: 5000 });
  //       this.getCart();
  //     },
  //     error => {
  //       const msg = error.error?.message || error.error || 'Erreur lors de l’ajout';
  //       this.snackbar.open(msg, 'Fermer', { duration: 5000 });
  //     }
  //   );
  // }

  // decreaseQuantity(productId: any) {
  //   this.customerService.decreaseProductQuantity(productId).subscribe(
  //     res => {
  //       this.snackbar.open('Quantité diminuée', 'Fermer', { duration: 5000 });
  //       this.getCart();
  //     },
  //     error => {
  //       const msg = error.error?.message || error.error || 'Erreur lors de la diminution';
  //       this.snackbar.open(msg, 'Fermer', { duration: 5000 });
  //     }
  //   );
  // }

  placeOrder() {
    this.dialog.open(PlaceOrderComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container'
    });
    
      }


  removeItem(demandeId: number): void {
    this.customerService.removeDemandeById(demandeId).subscribe({
      next: () => {
        this.snackbar.open("Produit supprimé ✅", "Fermer", { duration: 3000 });
        this.getCart();
        this.customerService.updateDemandeCount();

      },
      error: (err) => {
        this.snackbar.open("Erreur lors de la suppression", "Fermer", { duration: 3000 });
      }
    });

  }
  
  clearCart(): void {
    const userId = +UserStorageService.getUserId();
  
    this.customerService.clearCart(userId).subscribe({
      next: () => {
        this.snackbar.open("Panier vidé ✅", "Fermer", { duration: 3000 });
        this.getCart();
        this.customerService.updateDemandeCount();

      },
      error: (err) => {
        const errorMsg = err.error?.message || "Erreur lors du vidage du panier";
        this.snackbar.open(errorMsg, "Fermer", { duration: 3000 });
      }
    });
  }
  
}
