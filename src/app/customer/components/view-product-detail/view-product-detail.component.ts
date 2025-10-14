import { Component } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { ActivatedRoute } from '@angular/router';
import { UserStorageService } from '../../../services/storage/user-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginsComponent } from '../../../logins/logins.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-view-product-detail',
  standalone: false,
  templateUrl: './view-product-detail.component.html',
  styleUrls: ['./view-product-detail.component.css']
})
export class ViewProductDetailComponent {
  serviceId!: any;
  services: any = {}; // ✅ OBJET et non tableau
  reviews: any[] = [];
  mediaList: any[] = [];

  getActiveMedias() {
    this.customerService.getActiveMediaByServiceId(this.serviceId).subscribe({
      next: data => {
        console.log("🎬 Médias reçus :", data); // Ajout temporaire pour debug
        this.mediaList = data;
      },
      error: () => {
        this.snackbar.open('Erreur lors du chargement des médias', 'Fermer', { duration: 3000 });
      }
    });
  }
  
  hasImages(): boolean {
    return this.mediaList.some(media => media.type === 'IMAGE');
  }
  
  hasVideos(): boolean {
    return this.mediaList.some(media => media.type === 'VIDEO');
  }
  
  constructor(
    private customerService: CustomerService,
    private activatedroute: ActivatedRoute,
    private snackbar: MatSnackBar,
            private dialog: MatDialog
    
  ) {}
  ngOnInit(): void {
    this.serviceId = +this.activatedroute.snapshot.params['prodId'];
    if (!this.serviceId) {
      this.snackbar.open('ID de service invalide', 'Fermer', { duration: 3000 });
      return;
    }

    this.getProductDetailById();
    this.getActiveMedias();
  }


  getProductDetailById(): void {
    this.customerService.getProductDetailById(this.serviceId).subscribe({
      next: (res: any) => {
        console.log("📦 Détail produit :", res);
        this.services = res.productDto;

        if (this.services.base64Img) {
          this.services.processedImg = 'data:image/jpeg;base64,' + this.services.base64Img;
        }

        if (res.reviewDtoList?.length) {
          this.reviews = res.reviewDtoList.map((review: any) => {
            if (review.returnedImg) {
              review.processedImg = 'data:image/jpeg;base64,' + review.returnedImg;
            }
            return review;
          });
        } else {
          // fallback si aucun avis retourné
          this.loadReviewsFallback();
        }
      },
      error: () => {
        this.snackbar.open('Erreur lors du chargement du produit', 'Fermer', { duration: 3000 });
      }
    });
  }
  loadReviewsFallback(): void {
    this.customerService.getReviewsByProdId(this.serviceId).subscribe({
      next: (reviews: any[]) => {
        this.reviews = reviews.map((review: any) => {
          if (review.returnedImg) {
            review.processedImg = 'data:image/jpeg;base64,' + review.returnedImg;
          }
          return review;
        });
      },
      error: () => {
        this.snackbar.open('Erreur lors du chargement des avis', 'Fermer', { duration: 3000 });
      }
    });
  }

addToCart(serviceId: number): void {
    const userId = Number(UserStorageService.getUserId());
  
    if (!userId || isNaN(userId)) {
      const dialogRef = this.dialog.open(LoginsComponent, {
        width: '1000px',              // largeur fixe adaptée au design double-colonne
        maxWidth: '95vw',             // responsive si l'écran est petit
        height: 'auto',               // pour ne pas couper le bas du formulaire
        panelClass: 'custom-login-dialog', // optionnel pour un style plus propre
        disableClose: true
      });
      
  
      dialogRef.afterClosed().subscribe((loggedIn: boolean) => {
        if (loggedIn && UserStorageService.getUserId()) {
          this.addToCart(serviceId); // relancer l'ajout après login
        }
      });
  
      return;
    }
    const demande = {
      serviceId: serviceId,
      userId: Number(userId)
    };
  
    this.customerService.addToCart(demande).subscribe({
      next: (response: any) => {
        this.snackbar.open(response.message || 'Produit ajouté à la demande avec succès', 'Fermer', {
          duration: 3000
        });
      },
      error: (error) => {
        if (error.status === 409) {
          this.snackbar.open('Produit déjà dans la demande', 'Fermer', {
            duration: 3000
          });
        } else {
          this.snackbar.open('Erreur lors de l\'ajout', 'Fermer', {
            duration: 3000
          });
        }
      }
    });
  }
  
}