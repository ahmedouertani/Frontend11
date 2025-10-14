import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-copons',
  standalone:false,
  templateUrl: './copons.component.html',
  styleUrls: ['./copons.component.css']
})
  export class CoponsComponent implements OnInit {
    copons: any[] = [];
    editForm!: FormGroup;
    editingCoponId: number | null = null;
    showSidebar = false;
    selectedFile: File | null = null;
  
    constructor(
      private adminService: AdminService,
      private snackbar: MatSnackBar,
      private fb: FormBuilder
    ) {}
  
    ngOnInit(): void {
      this.initForm();
      this.getCopons();
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
        this.copons = res;
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
            this.snackbar.open('✅ Promo mis à jour avec succès', 'Fermer', { duration: 3000 });
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
  

  
    private formatDate(date: Date): string {
      const d = new Date(date);
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      const year = d.getFullYear();
      return `${year}-${month}-${day}`;
    }

    changeCoponStatus(coponId: number, status: string): void {
      this.adminService.updateCoponStatus(coponId, status).subscribe({
        next: () => {
          this.snackbar.open('Statut mis à jour avec succès.', 'Fermer', { duration: 3000 });
          this.getCopons(); // Recharge la liste des produits
        },
        error: (err) => {
          if (err.status === 403) {
            this.snackbar.open('❌ Vous ne pouvez pas annuler un service déjà réservé.', 'Fermer', {
              duration: 5000,
              panelClass: 'error-snackbar'
            });
          } 
        }
      });
    }
  }