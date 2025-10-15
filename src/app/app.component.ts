import { Component, HostListener, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { UserStorageService } from './services/storage/user-storage.service';
import { CustomerService } from './customer/services/customer.service';
import { catchError, debounceTime, distinctUntilChanged, filter, of, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from './admin/service/admin.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Tansi9Angular';
  searchProductForm!: FormGroup;
  services: any[] = [];
  searchForm: FormGroup;
  filteredServices: any[] = [];
  showSuggestions = false;
  dropdownOpen = false;

  isCustomerLoggedIn = false;
  isAdminLoggedIn = false;
  isPrestataireLoggedIn = false;
  showPublicAppBar = false;
  form!: FormGroup;

  showProdButtons = false;
  showEventsButtons = false;
  currentLogo = 'assets/logogroup.webp';

  demandeCount = 0;
  showScrollTop = false;
  userId = Number(UserStorageService.getUserId());

  constructor(
    private snackbar: MatSnackBar,
    private http: HttpClient,
    private router: Router,
    private adminService: AdminService,
    private fb: FormBuilder,
    private customerService: CustomerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.form = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.pattern(/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/)
      ]]
    });

    this.searchForm = this.fb.group({
      name: [''],
      minPrice: [''],
      maxPrice: [''],
      unavailableDate: [''] // Champ pour la date indisponible
    });
  }

  resetForm() {
    this.searchForm.reset();
    this.filteredServices = []; // Facultatif : vider les suggestions aussi
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;

        this.checkLoginStatus();

        // Affiche AppBar selon la page
        this.showProdButtons =
          url.includes('tansikprod') || url.includes('prodcontact') || url.includes('rendezvousprod');
        this.showEventsButtons =
          url.includes('tansikevents') || url.includes('eventscontact') || url.includes('rendezvousevents')|| url.includes('customer/event/' )||
          url.includes('customer/place-order-events')||url.includes('customer/promotions');
        // Logo dynamique
        if (this.showProdButtons) {
          this.currentLogo = 'assets/logoprod.webp';
        } else if (this.showEventsButtons) {
          this.currentLogo = 'assets/logoevents.webp';
        } else {
          this.currentLogo = 'assets/logogroup.webp';
        }
      });

    // Compteur demandes client
    if (UserStorageService.isCustomerLoggedIn()) {
      this.customerService.demandeCount$.subscribe(count => {
        this.demandeCount = count;
      });
      this.customerService.updateDemandeCount();
    }

    this.setupSearch();
  }


  checkLoginStatus(): void {
    this.isCustomerLoggedIn = UserStorageService.isCustomerLoggedIn();
    this.isAdminLoggedIn = UserStorageService.isAdminLoggedIn();
    this.isPrestataireLoggedIn = UserStorageService.isPrestataireLoggedIn();
    this.showPublicAppBar = !this.isCustomerLoggedIn && !this.isAdminLoggedIn && !this.isPrestataireLoggedIn;
  }

  logout(): void {
    UserStorageService.signOut();
    this.router.navigate(['/home'], { replaceUrl: true }).then(() => {
      window.location.reload();
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.showScrollTop = window.scrollY > 300;
  }

  scrollToTop(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  onSubmit() {
    if (this.form.invalid) return;

    this.http.post('http://localhost:8081/api/newsletter/invite', this.form.value, { responseType: 'text' })
      .subscribe({
        next: () => {
          this.snackbar.open('✅ Inscription réussie à la newsletter', 'Fermer', { duration: 3000 });
          this.form.reset();
        },
        error: (err) => {
          const msg = err.status === 400 ? err.error : '❌ Erreur d\'inscription';
          this.snackbar.open(msg, 'Fermer', { duration: 4000 });
        }
      });
  }

  onInscrireClient() {
    this.http.post(`http://localhost:8081/api/newsletter/client/${this.userId}`, {}, { responseType: 'text' })
      .subscribe({
        next: () => {
          this.snackbar.open('✅ Vous êtes inscrit à la newsletter', 'Fermer', { duration: 3000 });
        },
        error: (err) => {
          const msg = err.status === 400 ? err.error : '❌ Erreur d\'inscription';
          this.snackbar.open(msg, 'Fermer', { duration: 4000 });
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
  initSearchForm(): void {
    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
  }

  setupSearch(): void {
    this.searchForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      switchMap(formValue => {
        const { name, minPrice, maxPrice, unavailableDate } = formValue;

        const params: any = {};
        if (name) params.name = name;
        if (minPrice !== '' && minPrice !== null) params.minPrice = +minPrice;
        if (maxPrice !== '' && maxPrice !== null) params.maxPrice = +maxPrice;
        if (unavailableDate) params.unavailableDate = [unavailableDate];

        if (Object.keys(params).length === 0) {
          this.filteredServices = [];
          this.showSuggestions = false;
          return of([]);
        }

        return this.adminService.searchServices(params).pipe(
          tap(data => console.log('Résultats :', data)),
          catchError(error => {
            console.error('Erreur API :', error);
            return of([]);
          })
        );
      })
    ).subscribe(services => {
      this.filteredServices = services.map(service => ({
        ...service,
        processedImg: service.base64Img
          ? 'data:image/jpeg;base64,' + service.base64Img
          : 'assets/default-service.jpg'
      }));
      this.showSuggestions = this.filteredServices.length > 0;
    });
  }

  getServiceImage(service: any): string {
    return service.processedImg || 'assets/default-service.jpg';
  }

  navigateToService(service: any): void {
    if (!service?.id) return;

    const route = service.afficherDans === 'events'
      ? ['customer/event', service.id]
      : ['customer/service', service.id];

    this.router.navigate(route)
      .catch(() => this.router.navigate(['/dashboard']));

    this.resetSearch();
  }

  resetSearch(): void {
    this.searchForm.reset();
    this.filteredServices = [];
    this.showSuggestions = false;
  }
  onSearchSubmit(): void {
    const term = this.searchForm.get('searchTerm')?.value;
    if (term) {
      this.router.navigate(['/search-results'], { queryParams: { q: term } });
    }
  }

  onSearchBlur(): void {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }


  }
