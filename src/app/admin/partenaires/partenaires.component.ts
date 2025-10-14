import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from '../service/admin.service';

@Component({
  selector: 'app-partenaires',
  standalone: false,
  templateUrl: './partenaires.component.html',
  styleUrl: './partenaires.component.css'
})
export class PartenairesComponent {
  prestataires: any[] = [];
  isLoading = true;
  displayedColumns: string[] = ['nom', 'email','matriculefiscale','telephone','compteStatus', 'actions'];

  constructor(
    private authService: AuthService,    private adminService: AdminService,

    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadPrestataires();
  }

  loadPrestataires() {
    this.isLoading = true;
    this.authService.getAllPrestataires().subscribe({
      next: (data) => {
        this.prestataires = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.showError('Erreur lors du chargement des prestataires');
      }
    });
  }

  deletePrestataire(id: number): void {
    this.authService.deletePrestataireById(id).subscribe({
      next: (success) => {
        if (success !== false) { // attention, "success" est du texte
          this.prestataires = this.prestataires.filter(p => p.id !== id);
          this.snackBar.open('Prestataire supprimé avec succès', 'Fermer', { duration: 3000 });
        } else {
          this.snackBar.open('Prestataire introuvable ou non autorisé', 'Fermer', { duration: 3000 });
        }
      },
      error: (err) => {
        console.error('Erreur serveur', err);
        this.snackBar.open('Erreur technique lors de la suppression', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
  

  

  navigateToAdd() {
    this.router.navigate(['/admin/ajout-partenaire']);
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });

  }
  
  bloquerClient(id: number): void {
    this.adminService.bloquerUser(id).subscribe({
      next: () => {
        this.snackBar.open('Utilisateur bloqué.', 'Fermer', { duration: 3000 });
        this.loadPrestataires();
      },
      error: () => {
        this.snackBar.open('Erreur lors du blocage.', 'Fermer', { duration: 3000 });
      }
    });
  }
  
  debloquerClient(id: number): void {
    this.adminService.debloquerUser(id).subscribe({
      next: () => {
        this.snackBar.open('Utilisateur débloqué.', 'Fermer', { duration: 3000 });
        this.loadPrestataires();
      },
      error: () => {
        this.snackBar.open('Erreur lors du déblocage.', 'Fermer', { duration: 3000 });
      }
    });
  }
}