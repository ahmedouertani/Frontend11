import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../admin/service/admin.service';
import { UserStorageService } from '../../services/storage/user-storage.service';
import { CustomerService } from '../services/customer.service';
import { ReservationEventService } from '../../services/reservation-event.service';
import { LoginsComponent } from '../../logins/logins.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-tansikevents',
  standalone: false,
  templateUrl: './tansikevents.component.html',
  styleUrl: './tansikevents.component.css'
})
export class TansikeventsComponent {
  eventCategories: any[] = [];
  services: any[] = [];
  groupedServices: { [categoryId: string]: any[] } = {};
  userId = Number(UserStorageService.getUserId());
  showFinalizeButton: boolean = true;
  searchProductForm!: FormGroup;
  currentIndex: number = 0;
  private intervalId: any;
  categoryVisibility: { [id: string]: boolean } = {};

  constructor(private adminService: AdminService,
    private customerService:CustomerService,
    private snackbar:MatSnackBar,
    private router:Router,
        private dialog: MatDialog,
        private reservationService:ReservationEventService
    ,private route: ActivatedRoute

  ) {}
  ngOnInit(): void {
    this.loadData();
    this.getServices();
    this.startAutoSlide();
    this.stopAutoSlide();
    this.route.fragment.subscribe(fragment => {
        if (fragment) {
            this.scrollToSection(fragment);
        }
    });

    // Initialiser toutes les catégories comme visibles par défaut
    this.eventCategories.forEach(category => {
        this.categoryVisibility[category.id] = true; // Visible par défaut
    });
}
toggleCategoryVisibility(categoryId: string): void {
  this.categoryVisibility[categoryId] = !this.categoryVisibility[categoryId];
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
    loadData() {
      this.adminService.getAllCategories().subscribe(categories => {
        this.adminService.getAllProducts().subscribe(services => {
          this.services = services.filter(s => s.afficherDans === 'events' && s.status=='ACTIF');
          const usedCategoryIds = new Set(this.services.map(service => service.categoryId));
    
          const normalizedCategories = categories.map(cat => ({
            ...cat,
            id: cat.id || cat.Id || cat.ID
          }));
    
          this.eventCategories = normalizedCategories
            .filter(cat => cat.type === 'events' && usedCategoryIds.has(cat.id));
    
          // Initialiser la visibilité APRÈS avoir les catégories
          this.eventCategories.forEach(category => {
            this.categoryVisibility[category.id] = true; // Visible par défaut
          });
    
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
        this.services = data.filter(service => service.afficherDans === 'events');
      });
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
    scrollTo(categoryId: string | number) {
      const element = document.getElementById(categoryId.toString());
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }

goToDetail(id: number, type: 'prod' | 'event') {
  console.log('Navigating to detail with ID:', id, 'Type:', type);
  if (type === 'event') {
    this.router.navigate(['/customer/event', id]);
  } else {
    this.router.navigate(['/customer/service', id], { queryParams: { type: 'prod' } });
  }
}
    goToPlaceOrder() {
      this.router.navigate(['customer/place-order-events']);
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
          this.goToPlaceOrder();
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


   submitForm(): void {
    const title = this.searchProductForm.get('title')!.value;
    if (!title) return;

    this.services = [];
    this.adminService.getAllProductByName(title).subscribe(res => {
      res
        .filter(service => service.afficherDans === 'events')
        .forEach(service => {
          service.processedImg = 'data:image/jpeg;base64,' + service.base64Img;
          this.services.push(service);
        });
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
  


ngOnDestroy(): void {
  this.stopAutoSlide();
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
}
