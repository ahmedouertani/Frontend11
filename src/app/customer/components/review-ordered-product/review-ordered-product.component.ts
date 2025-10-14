import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../../services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserStorageService } from '../../../services/storage/user-storage.service';

@Component({
  selector: 'app-review-ordered-product',
  standalone: false,
  templateUrl: './review-ordered-product.component.html',
  styleUrls: ['./review-ordered-product.component.css']
})
export class ReviewOrderedProductComponent implements OnInit {
  serviceId: number | null = null;
  reservationEventId: number | null = null;
  reviewForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  userId: number;
  reservationProdId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private customerService: CustomerService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userId = Number(UserStorageService.getUserId());
    this.activatedRoute.queryParams.subscribe(params => {
      this.serviceId = params['serviceId'] ? Number(params['serviceId']) : null;
      this.reservationEventId = params['reservationEventId'] ? Number(params['reservationEventId']) : null;
      this.reservationProdId = params['reservationProdId'] ? Number(params['reservationProdId']) : null;

      console.log("🔎 serviceId:", this.serviceId);
      console.log("🔎 reservationEventId:", this.reservationEventId);
      console.log("🔎 reservationProdId:", this.reservationProdId);

    });
    this.initForm();
  }

  private initForm(): void {
    this.reviewForm = this.fb.group({
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      description: ['', [Validators.required, Validators.minLength(3)]]
    });
    this.activatedRoute.queryParams.subscribe(params => {
      console.log("QueryParams", params);
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  submitForm(): void {
    if (this.reviewForm.invalid || (!this.serviceId && !this.reservationEventId&&!this.reservationProdId)) {
      this.snackbar.open('Formulaire incomplet ou aucun identifiant de service/événement.', 'Fermer', { duration: 3000 });
      return;
    }

    const formData = new FormData();
    formData.append('userId', this.userId.toString());
    formData.append('rating', this.reviewForm.get('rating')?.value.toString());
    formData.append('description', this.reviewForm.get('description')?.value);
    if (this.serviceId !== null) formData.append('serviceId', this.serviceId.toString());
    if (this.reservationEventId !== null) formData.append('reservationEventId', this.reservationEventId.toString());
    if (this.reservationProdId !== null) formData.append('reservationProdId', this.reservationProdId.toString());

    if (this.selectedFile) formData.append('img', this.selectedFile);

    this.customerService.giveReview(formData).subscribe({
      next: () => {
        this.snackbar.open('✅ Avis envoyé avec succès', 'Fermer', { duration: 3000 });
        this.router.navigate(['/customer/my-orders']);
      },
      error: (err) => {
        this.snackbar.open(err?.error || '❌ Erreur lors de l\'envoi de l\'avis', 'Fermer', { duration: 3000 });
      }
    });
  }
}
