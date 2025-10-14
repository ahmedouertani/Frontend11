import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-modifier-comptes',
  standalone: false,
  templateUrl: './modifier-comptes.component.html',
  styleUrl: './modifier-comptes.component.css'
})
export class ModifierComptesComponent implements OnInit{
  editForm!: FormGroup;
  userId!: number;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  isLoading = false;
  imageDeleted = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = +this.route.snapshot.params['id'];
    this.initForm();
    this.loadUser();
  }

  initForm(): void {
    this.editForm = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      motdepasse: ['']
    });
  }

  loadUser(): void {
    this.authService.getUserById(this.userId).subscribe({
      next: (user) => {
        this.editForm.patchValue({
          nom: user.nom,
          email: user.email,
          telephone: user.telephone
        });
        if (user.img) {
          this.previewUrl = `data:image/jpeg;base64,${user.img}`;
        }
      },
      error: (err) => {
        console.error('Erreur chargement profil :', err); // 👈 Ajoute ceci
        this.showError("Erreur lors du chargement du profil utilisateur");
      }
    });
  }
  

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.showError('Seules les images sont autorisées');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        this.showError('L’image ne doit pas dépasser 2 Mo');
        return;
      }

      this.selectedFile = file;
      this.imageDeleted = false;

      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result;
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.previewUrl = null;
    this.selectedFile = null;
    this.imageDeleted = true;
  }

  onSubmit(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('nom', this.editForm.value.nom);
    formData.append('email', this.editForm.value.email);
    formData.append('telephone', this.editForm.value.telephone);

    if (this.editForm.value.motdepasse) {
      formData.append('motdepasse', this.editForm.value.motdepasse);
    }

    if (this.selectedFile) {
      formData.append('imgFile', this.selectedFile);
    }

    if (this.imageDeleted) {
      formData.append('removeImage', 'true');
    }

    this.authService.updateUserByAdmin(this.userId, formData).subscribe({
      next: () => {
        this.showSuccess('Utilisateur mis à jour');
        this.router.navigate(['/admin/utilisateurs']);
      },
      error: (err) => {
        const message = err?.error || "Erreur lors de la mise à jour";
        this.showError(message);
      }
    });
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
