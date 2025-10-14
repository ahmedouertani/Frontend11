import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../customer/services/customer.service';
import { UserStorageService } from '../../services/storage/user-storage.service';
import { AdminService } from '../service/admin.service';

@Component({
  selector: 'app-gestion-avis',
  standalone: false,
  templateUrl: './gestion-avis.component.html',
  styleUrl: './gestion-avis.component.css'
})
export class GestionAvisComponent {
  serviceId: number | null = null;
  eventId: number | null = null;
  prodId: number | null = null;

  services: any = {};
  event: any = {};
  prod: any = {};

  reviews: any[] = [];
  medias: any[] = []; // ✅ pour stocker les médias
  isAdmin: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private snackbar: MatSnackBar,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.isAdmin = UserStorageService.getUserRole() === 'ADMIN';
    const id = +this.route.snapshot.paramMap.get('id')!;
    const isEventPage = this.route.snapshot.routeConfig?.path?.startsWith('gestion-avis-event');
  
    if (isEventPage) {
      this.eventId = id;
      this.loadEventDetails();
      this.loadEventReviews();
      this.loadEventMedia(); // ✅ Charger les médias pour l'événement
    } else {
      this.serviceId = id;
      this.prodId = id;

      this.loadProdDetails();
      this.loadProdReviews();
      this.loadMedia(); // ✅ Charger les médias pour le produit
    }
  }
  

  getProductDetailById(): void {
    this.customerService.getProductDetailById(this.serviceId!).subscribe(res => {
      this.services = res.productDto;
      this.services.processedImg = 'data:image/jpeg;base64,' + this.services.base64Img;
      this.reviews = (res.reviewDtoList || []).map(r => ({
        ...r,
        processedImg: r.returnedImg ? 'data:image/jpeg;base64,' + r.returnedImg : null
      }));
    }, err => {
      this.snackbar.open("Erreur lors du chargement du produit", 'Fermer', { duration: 3000 });
    });
  }

  loadProdDetails(): void {
    this.customerService.getProdDetailById(this.prodId!).subscribe(res => {
      this.prod = res.prodDto;
      this.prod.processedImg = 'data:image/jpeg;base64,' + this.prod.base64Img;
    }, err => {
      this.snackbar.open("Erreur lors du chargement de l'événement", 'Fermer', { duration: 3000 });
    });
  }
  loadEventDetails(): void {
    this.customerService.getEventDetailById(this.eventId!).subscribe(res => {
      this.event = res.eventDto;
      this.event.processedImg = 'data:image/jpeg;base64,' + this.event.base64Img;
    }, err => {
      this.snackbar.open("Erreur lors du chargement de l'événement", 'Fermer', { duration: 3000 });
    });
  }
  loadReviewsFallback(): void {
    this.customerService.getReviewsByProdId(this.serviceId).subscribe({
      next: (reviews: any[]) => {
        this.reviews = reviews.map((review: any) => {
          return review;
        });
      },
      error: () => {
        this.snackbar.open('Erreur lors du chargement des avis', 'Fermer', { duration: 3000 });
      }
    });
  }

  loadEventReviews(): void {
    this.customerService.getReviewsByEventId(this.eventId!).subscribe(res => {
      this.reviews = (res || []).map(r => ({
        ...r,
        processedImg: r.returnedImg ? 'data:image/jpeg;base64,' + r.returnedImg : null
      }));
    }, err => {
      this.snackbar.open("Erreur lors du chargement des avis", 'Fermer', { duration: 3000 });
    });
  }

  loadProdReviews(): void {
    this.customerService.getReviewsByProdId(this.prodId!).subscribe(res => {
      this.reviews = (res || []).map(r => ({
        ...r,
        processedImg: r.returnedImg ? 'data:image/jpeg;base64,' + r.returnedImg : null
      }));
    }, err => {
      this.snackbar.open("Erreur lors du chargement des avis", 'Fermer', { duration: 3000 });
    });
  }


  deleteReview(id: number): void {
    if (confirm('Confirmer la suppression de cet avis ?')) {
      this.adminService.deleteReviewById(id).subscribe({
        next: () => {
          this.snackbar.open('✅ Avis supprimé', 'Fermer', { duration: 3000 });
          this.refreshReviews();
        },
        error: (err) => {
          const errorMessage = err?.error?.message || '❌ Erreur lors de la suppression';
          this.snackbar.open(errorMessage, 'Fermer', { duration: 3000 });
          console.error('Erreur lors de la suppression de l\'avis :', err);
        }
      });
    }
  }

  refreshReviews(): void {
    if (this.prodId) {
      this.loadProdReviews();
    } else if (this.eventId) {
      this.loadEventReviews();
    }
  }

  // ✅ Récupérer les médias du service
  loadMedia(): void {
    this.customerService.getMediaByServiceId(this.serviceId!).subscribe({
      next: data => this.medias = data,
      // error: () => this.snackbar.open('Erreur chargement médias', 'Fermer', { duration: 3000 })
    });
  }
  loadEventMedia(): void {
    this.customerService.getMediaByServiceId(this.eventId!).subscribe({
      next: data => {
        console.log('Médias pour événement:', data); // Vérifier les données reçues
        this.medias = data;
      },
      error: err => {
        console.error('Erreur API médias:', err); // Loguer l'erreur
        // this.snackbar.open('Erreur chargement médias', 'Fermer', { duration: 3000 });
      }
    });
  }

  
  // ✅ Supprimer un média
// Méthode unifiée pour changer le statut
updateMediaStatus(mediaId: number, newStatus: string, updateLocal?: any): void {
  console.log("🔄 Statut envoyé:", newStatus);
  
  // Normalisation du statut
  const normalizedStatus = newStatus.toUpperCase();
  
  this.adminService.updateMediaStatus(mediaId, normalizedStatus).subscribe({
    next: (res) => {
      // Afficher la réponse complète dans la console
      console.log('Réponse du backend:', res);
      
      // Vérifier si la réponse contient bien un champ message
      const successMessage = res?.message || `Statut mis à jour : ${normalizedStatus}`;
      this.snackbar.open(successMessage, 'Fermer', { duration: 3000 });
      
      // Mise à jour locale ou rechargement
      if (updateLocal) {
        updateLocal.status = normalizedStatus; // Mise à jour locale
      } else {
        this.loadMedia(); // Rechargement complet des données
      }
    },
    // error: (err) => {
    //   console.error('Erreur détaillée:', err);

    //   // Afficher le message d'erreur complet
    //   const errorMsg = err.error?.error || 'Erreur changement de statut';
    //   this.snackbar.open(errorMsg, 'Fermer', { duration: 3000 });
    // }
  });
}



toggleMediaStatus(media: any): void {
  const newStatus = media.status === 'ACTIF' ? 'ANNULE' : 'ACTIF';
  
  this.updateMediaStatus(media.id, newStatus, media); // Mettre à jour le statut et le média localement
}
}