import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../service/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-copon',
  standalone: false,
  templateUrl: './post-copon.component.html',
  styleUrl: './post-copon.component.css'
})
export class PostCoponComponent {
  coponForm!: FormGroup;
  selectedFile: File | null = null;
  showSidebar = false;

  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.coponForm = this.fb.group({
      name: [null, Validators.required],
      code: [null, Validators.required],
      discount: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
      expirationDate: [null, Validators.required],
      description: [null],
      montantReservationExiges: [null]

    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  addCopon(): void {
    if (this.coponForm.invalid) {
      this.snackBar.open('Veuillez remplir tous les champs obligatoires', 'Fermer', { duration: 3000 });
      this.coponForm.markAllAsTouched();
      return;
    }
  
    const formData = new FormData();
    formData.append('name', this.coponForm.value.name);
    formData.append('code', this.coponForm.value.code);
    formData.append('discount', this.coponForm.value.discount.toString());
    formData.append('expirationDate', this.formatDate(this.coponForm.value.expirationDate)); // ✅ format correct
    formData.append('description', this.coponForm.value.description || '');
    if (this.selectedFile) {
      formData.append('img', this.selectedFile);
    }
        formData.append('montantReservationExiges', this.coponForm.value.montantReservationExiges || '');

    this.adminService.addCopon(formData).subscribe({
      next: (res) => {
        this.snackBar.open('✅ Promo ajouté avec succès', 'Fermer', { duration: 3000 });
        this.router.navigateByUrl('/admin/dashboard');
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('❌ Erreur lors de l’ajout du coupon', 'Fermer', { duration: 3000 });
      }
    });
  }
  
  formatDate(date: any): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
}