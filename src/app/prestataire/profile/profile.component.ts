import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../../customer/services/customer.service';
import { UserStorageService } from '../../services/storage/user-storage.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  profileForm: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  isLoading = false;
  userId: number;
  imageDeleted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [
        Validators.required,
        Validators.pattern(/^.+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|live\.com)$/)
      ]],
      telephone: ['', [Validators.required, Validators.pattern(/^\d{8,}$/)]],

      motdepasse:[
        '',
        [
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/),
        ],
      ]    });

    this.userId = Number(UserStorageService.getUserId());
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.customerService.getProfile(this.userId).subscribe({
      next: (res) => {
        this.profileForm.patchValue({
          nom: res.nom,
          email: res.email,
          telephone: res.telephone
        });
        if (res.img) {
          this.previewUrl = res.img.startsWith('data:image') 
            ? res.img 
            : `data:image/jpeg;base64,${res.img}`;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.showError(err.error?.error || 'Erreur lors du chargement du profil');
        this.isLoading = false;
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        this.showError('Seules les images sont autorisées (JPEG, PNG)');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        this.showError('L’image ne doit pas dépasser 2 Mo');
        return;
      }

      this.selectedFile = file;
      this.imageDeleted = false;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formData = new FormData();
    formData.append('nom', this.profileForm.value.nom);
    formData.append('email', this.profileForm.value.email);
    formData.append('telephone', this.profileForm.value.telephone);

    if (this.profileForm.value.motdepasse) {
      formData.append('motdepasse', this.profileForm.value.motdepasse);
    }

    if (this.selectedFile) {
      formData.append('imgFile', this.selectedFile);
    }

    if (this.imageDeleted) {
      formData.append('removeImage', 'true');
    }

    this.customerService.updateProfileWithImage(this.userId, formData).subscribe({
      next: () => {
        this.showSuccess('Profil mis à jour avec succès');
        this.loadProfile();
        this.selectedFile = null;
        this.isLoading = false;
        this.imageDeleted = false;
      },
      error: (err) => {
        const message = typeof err.error === 'string' ? err.error : 'Erreur lors de la mise à jour';
        this.showError(message);
        this.isLoading = false;
      }
    });
    
  }

  removeImage(): void {
    this.previewUrl = null;
    this.selectedFile = null;
    this.imageDeleted = true;
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}