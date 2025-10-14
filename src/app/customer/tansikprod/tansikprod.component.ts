import { Component, Inject, OnInit } from '@angular/core';
import { CustomerService } from '../services/customer.service';
import { AdminService } from '../../admin/service/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserStorageService } from '../../services/storage/user-storage.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { LoginsComponent } from '../../logins/logins.component';
import { MatIconModule } from '@angular/material/icon';
import { FormGroup } from '@angular/forms';
import { CollabService, Collab } from '../../services/collab.service';
  

@Component({
  selector: 'app-login-dialog',
  template: `
<mat-card class="login-dialog-card">
<button mat-icon-button class="close-btn" (click)="onCloseDialog()" aria-label="Fermer">
    <mat-icon>close</mat-icon>
  </button>
</mat-card>

  `,
  standalone: true,
  imports: [MatCardModule, MatButtonModule,MatIconModule]
})
export class LoginDialogTemplate {
  constructor(
    public dialogRef: MatDialogRef<LoginDialogTemplate>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) {}
  onCloseDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close(false);
    }
  }
  
  onLogin(): void {
    this.dialogRef.close(true);
    this.router.navigate(['/logins']);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}

@Component({
  selector: 'app-tansikprod',
  standalone: false,
  templateUrl: './tansikprod.component.html',
  styleUrl: './tansikprod.component.css'
})
export class TansikprodComponent  implements OnInit {
  prodCategories: any[] = [];
  services: any[] = [];
  groupedServices: { [categoryId: string]: any[] } = {};
  userId = Number(UserStorageService.getUserId());
  isCustomerLoggedIn=false

  eventCategories: any[] = [];

  showFinalizeButton: boolean = false;
  searchProductForm!: FormGroup;
  currentIndex: number = 0;
  private intervalId: any;


  constructor(private adminService: AdminService,
    private customerService:CustomerService,
    private snackbar:MatSnackBar,
    private collabService: CollabService,
    private router:Router,
        private dialog: MatDialog
    

  ) {}


  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.next();
    }, 3000); // Change l'image toutes les 3 secondes
  }

  stopAutoSlide() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }


  ngOnInit(): void {
    
    this.loadData();
    this.getServices();
    this.loadCollabs(); 
  }
  autorise(): void {
    this.isCustomerLoggedIn = UserStorageService.isCustomerLoggedIn();

  }
  loadData() {
    this.adminService.getAllCategories().subscribe(categories => {
      this.adminService.getAllProducts().subscribe(services => {
        this.services = services.filter(s => s.afficherDans === 'prod' && s.status=='ACTIF');
  
        // Récupérer tous les IDs de catégories qui ont au moins un service
        const usedCategoryIds = new Set(this.services.map(service => service.categoryId));
  
        // Ne garder que les catégories utilisées
        this.prodCategories = categories
          .filter(cat => cat.type === 'prod' && usedCategoryIds.has(cat.id))
          .map(cat => ({
            ...cat,
            id: cat.id || cat.Id || cat.ID
          }));
  
        this.groupServicesByCategory();
      });
    });
  }
  
  groupServicesByCategory() {
    this.groupedServices = {};
    this.services.forEach(service => {
      const categoryId = service.categoryId;
      if (!this.groupedServices[categoryId]) {
        this.groupedServices[categoryId] = [];
      }
      this.groupedServices[categoryId].push(service);
    });
  }
  getServices() {
    this.adminService.getAllProducts().subscribe(data => {
      this.services = data.filter(service => service.afficherDans === 'prod');
    });
  }

  scrollTo(categoryId: string | number) {
    const element = document.getElementById(categoryId.toString());
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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
  moveSlide(direction: string): void {
    if (direction === 'next') {
      this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    } else {
      this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    }
  }

  onReadMoreClick(slide: any): void {
    console.log('Read more clicked for', slide);
  }

  showContent(slide: any): void {
    console.log('Slide clicked:', slide);
  }

  slides = [
    {
      src: 'assets/logogroup.webp',
      title: "Lossless Youths",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
    {
      src: 'assets/logoprod.webp',
      title: "Estrange Bond",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
    {
      src: 'assets/logoevents.webp',
      title: "The Gate Keeper",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    }
  ];
  // Modifiez vos méthodes next() et prev() pour utiliser handleButtonClick
  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateSliderPosition();
  }
  
  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updateSliderPosition();
  }
  images: { src: string, title: string, description: string ,route: string}[] = [
    {
      src: 'assets/marketing.webp',
      title: ' Tansik Group',
      description: 'Description du logo de Tansik Group.',
      route: '/home'

    },
    {
      src: 'assets/events.webp',
      title: ' Tansik Events',
      description: 'Resérvation des evennements mariage,conference,thour etc .',
      route: '/customer/tansikevents'

    },
    {
      src: 'assets/goup.webp',
      title: 'Tansik Prod',
      description: 'Service marketing .',
      route: '/customer/tansikprod'

    }
  ];


ngOnDestroy(): void {
  this.stopAutoSlide();
}
private showError(message: string): void {
  this.snackbar.open(message, 'Fermer', { duration: 3000 });
}

goToSlide(index: number) {
  this.stopAutoSlide();
  this.currentIndex = index;
  this.updateSliderPosition();
  this.startAutoSlide();
}

handleButtonClick(direction: 'prev' | 'next') {
  this.stopAutoSlide();
  if (direction === 'prev') {
    this.prev();
  } else {
    this.next();
  }
  this.startAutoSlide();
}

private updateSliderPosition() {
  const slider = document.querySelector('.slider') as HTMLElement;
  if (slider) {
    slider.style.transform = `translateX(-${this.currentIndex * 100}%)`;
  }
}
  
  
  
  scrollToSection(arg0: string) {
    throw new Error('Method not implemented.');
    }
      scrollToo(sectionId: string): void {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
  private loadCollabs(): void {
    this.collabService.getAll().subscribe({
      next: (data) => {
        this.logos = data;
        console.log("✅ Collabs chargés :", this.logos);
      },
      error: () => this.showError("Erreur lors du chargement des partenaires")
    });
  }  
    
      
  logos: Collab[] = [];
  goToCollab(id: number) {
  this.router.navigate(['/collab', id]);
  }



      goToDetail(id: number, type: 'prod' | 'event') {
        
        if (type === 'event') {
          this.router.navigate(['customer/event', id]);
        } else {
          this.router.navigate(['customer/service', id], { queryParams: { type } });
        }
      }
      
}