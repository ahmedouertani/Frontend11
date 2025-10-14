import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-clients',
  standalone: false,
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent {
  clients: any[] = [];
  isLoading = true;
  displayedColumns: string[] = ['nom', 'email','telephone','compteStatus', 'actions'];
  showSidebar = false;

  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;}

  ngOnInit(): void {
    this.loadClients();
  }
  constructor(
    private authService: AuthService,    private adminService: AdminService,

    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) {}
  loadClients() {
    this.isLoading = true;
    this.authService.getAllClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  deleteCustomerAndOrders(userId: number) {
    this.authService.deleteCustomerAndOrders(userId).subscribe({
      next: (result) => {
        if (result.success) {
          // 1. Mettre à jour la liste locale
          this.clients = this.clients.filter(c => c.id !== userId);
          
          // 2. Afficher le message de succès
          this.snackBar.open(result.message || 'Client supprimé avec succès', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        } else {
          // Cas où le client n'existe pas
          this.snackBar.open(result.message || 'Client introuvable', 'Fermer', {
            duration: 3000,
            panelClass: ['warning-snackbar']
          });
        }
      },
      error: (err) => {
        // Erreurs techniques (500, etc.)
        console.error('Erreur:', err);
        this.snackBar.open(
          err.message || 'Erreur technique lors de la suppression', 
          'Fermer', 
          {
            duration: 3000,
            panelClass: ['error-snackbar']
          }
        );
      }
    });
  }

  bloquerClient(id: number): void {
    this.adminService.bloquerUser(id).subscribe({
      next: () => {
        this.snackBar.open('Utilisateur bloqué.', 'Fermer', { duration: 3000 });
        this.loadClients();
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
        this.loadClients();
      },
      error: () => {
        this.snackBar.open('Erreur lors du déblocage.', 'Fermer', { duration: 3000 });
      }
    });
  }
  
    }
