import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../../../services/customer.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserStorageService } from '../../../../services/storage/user-storage.service';

@Component({
  selector: 'app-place-order',
  standalone:false,
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css']
})
export class PlaceOrderComponent implements OnInit {
  orderForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private customerService: CustomerService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      reservationDescription: ['', Validators.required],
      adresse: ['', Validators.required]

    });
  }
  

  placeOrder(): void {
    if (this.orderForm.invalid) return;
  
    const payload = {
      userId: Number(UserStorageService.getUserId()),
      reservationDescription: this.orderForm.value.reservationDescription,
      adresse: this.orderForm.value.adresse

    };
  
    this.isSubmitting = true;
  
    this.customerService.placeOrder(payload).subscribe({
      next: () => {
        this.snackbar.open('Commande envoyée avec succès', 'Fermer', { duration: 4000 });
        this.router.navigateByUrl("/customer/my-orders");
        this.closeForm();
      },
      error: () => {
        this.isSubmitting = false;
        this.snackbar.open('Erreur lors de la commande', 'Fermer', { duration: 4000 });
      }
    });
  }
  

  closeForm() {
    this.dialog.closeAll();
  }
}
