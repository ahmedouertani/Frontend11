import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../admin/service/admin.service';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-promotions',
  standalone: false,
  templateUrl: './promotions.component.html',
  styleUrl: './promotions.component.css'
})
export class PromotionsComponent implements OnInit {
    copons: any[] = [];
    editForm!: FormGroup;
    editingCoponId: number | null = null;
    showSidebar = false;
    selectedFile: File | null = null;
  
    constructor(
      private adminService: AdminService,
      private snackbar: MatSnackBar,
      private fb: FormBuilder,private clipboard: Clipboard

    ) {}
  
    ngOnInit(): void {
      this.initForm();
      this.getCopons();
    }
    copyCode(code: string) {
      this.clipboard.copy(code);
      this.snackbar.open('Code copié !', 'Fermer', {
        duration: 2000,
      });
    }
    toggleSidebar(): void {
      this.showSidebar = !this.showSidebar;
    }
  
    initForm(): void {
      this.editForm = this.fb.group({
        name: ['', Validators.required],
        code: ['', Validators.required],
        discount: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
        expirationDate: ['', Validators.required],
        img: [''],
        description: [''],
        montantReservationExiges:['']
      });
    }
  
    getCopons(): void {
      this.adminService.getCopon().subscribe(res => {
        // Filter the copons to only include those with status 'actif'
        this.copons = res.filter(copon => copon.status === 'ACTIF');
      });
    }
  
    startEdit(copon: any): void {
      this.editingCoponId = copon.id;
      this.editForm.patchValue({
        name: copon.name,
        code: copon.code,
        discount: copon.discount,
        expirationDate: new Date(copon.expirationDate),
        description: copon.description || '',
        img: copon.base64Img,
        montantReservationExiges:copon.montantReservationExiges
      });
      this.selectedFile = null;
    }
  
    cancelEdit(): void {
      this.editingCoponId = null;
      this.editForm.reset();
    }
  
    onFileSelected(event: any): void {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
        const reader = new FileReader();
        reader.onload = () => {
          const img = reader.result?.toString().split(',')[1];
          this.editForm.patchValue({ img: img });
        };
        reader.readAsDataURL(file);
      }
    }
  
    updateCopon(): void {
      if (this.editForm.valid && this.editingCoponId !== null) {
        const formData = new FormData();
        formData.append('name', this.editForm.get('name')?.value);
        formData.append('code', this.editForm.get('code')?.value);
        formData.append('discount', this.editForm.get('discount')?.value);
        formData.append('expirationDate', this.formatDate(this.editForm.get('expirationDate')?.value));
        formData.append('description', this.editForm.get('description')?.value || '');
        if (this.selectedFile) {
          formData.append('img', this.selectedFile);
        }
        formData.append('montantReservationExiges', this.editForm.get('montantReservationExiges')?.value || '');

        this.adminService.updateCopon(this.editingCoponId, formData).subscribe({
          next: () => {
            this.snackbar.open('✅ Coupon mis à jour avec succès', 'Fermer', { duration: 3000 });
            this.getCopons();
            this.cancelEdit();
          },
          error: (err) => {
            const message = err.error?.error || err.error?.message || 'Erreur lors de la mise à jour';
            this.snackbar.open(`❌ ${message}`, 'Fermer', { duration: 3000 });
          }
        });
      }
    }
  
    deleteCopon(coponId: number): void {
      this.adminService.deleteCopon(coponId).subscribe({
        next: (res) => {
          const message = res?.message || 'Coupon supprimé avec succès';
          this.snackbar.open(`✅ ${message}`, 'Fermer', { duration: 3000 });
          this.getCopons();
        },
        error: (err) => {
          const message = err.error?.error || err.error?.message || 'Erreur lors de la suppression';
          this.snackbar.open(`❌ ${message}`, 'Fermer', { duration: 3000 });
        }
      });
    }
  
    private formatDate(date: Date): string {
      const d = new Date(date);
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      const year = d.getFullYear();
      return `${year}-${month}-${day}`;
    }
  }