import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { title } from 'process';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
  export class DashboardComponent implements OnInit {
    services: any[] = [];
    searchProductForm!: FormGroup;
    showSidebar = false;
  
    constructor(
      private adminService: AdminService,
      private fb: FormBuilder,
      private snackbar: MatSnackBar,
      private router:Router
    ) {}
  
    ngOnInit(): void {
      this.getAllProducts();
      this.searchProductForm = this.fb.group({
        title: [null, Validators.required]
      });
    }
  
    toggleSidebar(): void {
      this.showSidebar = !this.showSidebar;
    }
  
    getAllProducts(): void {
      this.services = [];
      this.adminService.getAllProducts().subscribe(res => {
        res
          .filter(service => service.afficherDans === 'prod') // ✅ Filtrage
          .forEach(service => {
            service.processedImg = 'data:image/jpeg;base64,' + service.base64Img;
            this.services.push(service);
          });
      });
    }
  
    submitForm(): void {
      const title = this.searchProductForm.get('title')!.value;
      if (!title) return;
  
      this.services = [];
      this.adminService.getAllProductByName(title).subscribe(res => {
        res
          .filter(service => service.afficherDans === 'prod') // ✅ Filtrage recherche
          .forEach(service => {
            service.processedImg = 'data:image/jpeg;base64,' + service.base64Img;
            this.services.push(service);
          });
      });
    }
  
    deleteProduct(serviceId: any): void {
      this.adminService.deleteProduct(serviceId).subscribe({
        next: () => {
          this.snackbar.open('Produit supprimé avec succès !', 'Fermer', { duration: 5000 });
          this.getAllProducts();
        },
        error: (err) => {
          if (err.status === 200) {
            this.snackbar.open('Produit supprimé (erreur de parsing).', 'Fermer', { duration: 5000 });
            this.getAllProducts();
          } else {
            this.snackbar.open('tu ne peut pas supprimer un produit commandée', 'Fermer', {
              duration: 5000,
              panelClass: 'error-snackbar'
            });
          }
        }
      });
    }
    changeStatus(serviceId: number, status: string): void {
      this.adminService.updateStatus(serviceId, status).subscribe({
        next: () => {
          this.snackbar.open('Statut mis à jour avec succès.', 'Fermer', { duration: 3000 });
          this.getAllProducts(); // Recharge la liste des produits
        },
        error: (err) => {
          if (err.status === 403) {
            this.snackbar.open('❌ Vous ne pouvez pas annuler un service déjà réservé.', 'Fermer', {
              duration: 5000,
              panelClass: 'error-snackbar'
            });
          } else if (err.status === 400) {
            this.snackbar.open('Statut invalide fourni.', 'Fermer', {
              duration: 4000,
              panelClass: 'error-snackbar'
            });
          } else if (err.status === 404) {
            this.snackbar.open('Service introuvable.', 'Fermer', {
              duration: 4000,
              panelClass: 'error-snackbar'
            });
          } else {
            this.snackbar.open('Erreur lors de la mise à jour du statut.', 'Fermer', {
              duration: 3000,
              panelClass: 'error-snackbar'
            });
          }
        }
      });
    }
    
    
    goToDetail(id: number) {
      this.router.navigate(['admin/gestion-avis', id]);
    }
  deleteService(index: number) {
      const id = this.services[index].id;
      if (id && confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
        this.adminService.deleteService(id).subscribe({
          next: () => {
            // Recharger la liste ou supprimer localement pour mettre à jour l'UI
            this.services.splice(index, 1); // supprime directement du tableau local
          },
          error: (err) => {
            console.error("Erreur lors de la suppression :", err);
          }
        });
      }
    }
    
  }