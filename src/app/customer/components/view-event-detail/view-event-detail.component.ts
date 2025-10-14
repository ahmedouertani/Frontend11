import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { UserStorageService } from '../../../services/storage/user-storage.service';
import { LoginsComponent } from '../../../logins/logins.component';
import { MatDialog } from '@angular/material/dialog';
import { ReservationEventService } from '../../../services/reservation-event.service';

@Component({
  selector: 'app-view-event-detail',
  standalone: false,
  templateUrl: './view-event-detail.component.html',
  styleUrl: './view-event-detail.component.css'
})
  export class ViewEventDetailComponent implements OnInit {
    serviceId!: number;
    services: any = {};
    reviews: any[] = [];
    mediaList: any[] = [];
    showFinalizeButton: boolean = false;
    selectedMedia: any = null;
    overlayMedia: any = null;
    overlayType: 'image' | 'video' | null = null;
    selectedType: 'image' | 'video' | null = null;

    constructor(
      private route: ActivatedRoute,
      private customerService: CustomerService,
      private snackbar: MatSnackBar,
        private dialog: MatDialog,
        private router:Router,
        private reservationService:ReservationEventService

    ) {}
    openOverlay(media: any, type: 'image' | 'video') {
      this.selectedMedia = media;
      this.selectedType = type;
    }
    
    closeOverlay() {
      this.selectedMedia = null;
      this.selectedType = null;
    }
    hasImages(): boolean {
      return this.mediaList.some(m => m.type === 'IMAGE');
    }
    
    hasVideos(): boolean {
      return this.mediaList.some(m => m.type === 'VIDEO');
    }

    ngOnInit(): void {
      this.serviceId = +this.route.snapshot.paramMap.get('eventId')!;
      this.loadEventDetails();
      this.loadEventReviews();
      this.getActiveMedias(); // ✅ ajout obligatoire ici

    }
    goToPlaceOrder() {
      this.router.navigate(['customer/place-order-events']);
    }

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
    reserver(serviceId: number): void {
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
            this.reserver(serviceId); // relancer l'ajout après login
      
              this.router.navigate(['customer/place-order-events']);
            
        }
        });
    
        return;
      }
  
   
       this.reservationService.ajouterDemande(userId, serviceId).subscribe({
         next: () => {
           this.snackbar.open('Produit Ajouté au réservérvations  ✅', 'Fermer', { duration: 2000 });
           this.showFinalizeButton = true;
         },
         error: err => {
           this.snackbar.open('Erreur lors de la réservation ❌', 'Fermer', { duration: 3000 });
           console.error(err);
         }
       });
     }

    loadEventDetails(): void {
      this.customerService.getEventDetailById(this.serviceId).subscribe({
        next: res => {
          this.services = res.eventDto;
          if (this.services.base64Img) {
            this.services.processedImg = 'data:image/jpeg;base64,' + this.services.base64Img;
          }
        },
        error: err => {
          this.snackbar.open("Erreur lors du chargement de l'événement", 'Fermer', { duration: 3000 });
        }
      });
    }
  
    loadEventReviews(): void {
      this.customerService.getReviewsByEventId(this.serviceId).subscribe({
        next: res => {
          this.reviews = res.map(r => ({
            ...r,
            processedImg: r.returnedImg ? 'data:image/jpeg;base64,' + r.returnedImg : null
          }));
        }
      });
      
    
  }}