import { Component, OnDestroy, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

import { CustomerService } from '../customer/services/customer.service';
import { AdminService } from '../admin/service/admin.service';
import { CollabService, Collab } from '../services/collab.service';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  // ------- VOTRE DONNÉES -------
  hide = true;
  searchProductForm!: FormGroup;
  wishlistServiceIds: number[] = [];
  demandes: any[] = [];
  servicesEvents: any[] = [];
  categoriesProd: any[] = [];
  categoriesEvents: any[] = [];

  currentIndex = 0;
  private intervalId: any;
  private autoSlideDelay = 4500;

  logos: Collab[] = [];
  isReducedMotion = false;

  // slider principal
  images: { src: string, title: string, description: string, route: string }[] = [
    {
      src: 'assets/marketing.webp',
      title: 'Tansik Group',
      description: 'Agence de marketing & événementiel',
      route: '/home'
    },
    {
      src: 'assets/goup.webp',
      title: 'Tansik Prod',
      description: 'Marketing, brand & contenu',
      route: '/customer/tansikprod'
    },
    {
      src: 'assets/events.webp',
      title: 'Tansik Events',
      description: 'Mariages, séminaires, inaugurations…',
      route: '/customer/tansikevents'
    }
  ];

  constructor(
    private customerService: CustomerService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    private adminService: AdminService,
    private collabService: CollabService,
    private seoService: SeoService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // ================== CYCLE DE VIE ==================
  ngOnInit(): void {
    // SEO - Do this first for SSR
    this.initializeSeo();

    // Only run browser-specific code in browser
    if (isPlatformBrowser(this.platformId)) {
      // Motion settings
      this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (this.isReducedMotion) this.autoSlideDelay = 0;

      if (!this.isReducedMotion) this.startAutoSlide();

      // IO pour animations d'apparition
      this.observeAppear();
    }

    this.loadData();
    this.loadCollabs();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  // ================== DATA ==================
  private loadCollabs(): void {
    this.collabService.getAll().subscribe({
      next: (data) => {
        this.logos = data;
      },
      error: () => this.showError("Erreur lors du chargement des partenaires")
    });
  }

  private loadData(): void {
    this.adminService.getAllCategory().subscribe({
      next: (resCategories) => {
        this.adminService.getAllProducts().subscribe({
          next: (resServices) => {
            const prodServices = resServices.filter((s: any) => s.afficherDans === 'prod');
            const eventsServices = resServices.filter((s: any) => s.afficherDans === 'events');

            const prodCategoryIds = new Set(prodServices.map((s: any) => s.categoryId));
            const eventsCategoryIds = new Set(eventsServices.map((s: any) => s.categoryId));

            this.categoriesProd = resCategories.filter(
              (cat: any) => cat.type === 'prod' && prodCategoryIds.has(cat.id)
            );
            this.categoriesEvents = resCategories.filter(
              (cat: any) => cat.type === 'events' && eventsCategoryIds.has(cat.id)
            );

            // Ré-injecte le JSON-LD une fois les catégories chargées
            this.refreshJsonLd();
          },
          error: () => this.showError('Erreur lors du chargement des services')
        });
      },
      error: () => this.showError('Erreur de chargement des catégories')
    });
  }

  private showError(message: string): void {
    this.snackbar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  // ================== SLIDER ==================
  startAutoSlide(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.autoSlideDelay <= 0) return;
    this.stopAutoSlide();
    this.intervalId = setInterval(() => this.next(), this.autoSlideDelay);
  }

  stopAutoSlide(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  next(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateSliderPosition();
  }

  prev(): void {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updateSliderPosition();
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
    this.updateSliderPosition();
    if (!this.isReducedMotion && isPlatformBrowser(this.platformId)) {
      this.startAutoSlide();
    }
  }

  handleButtonClick(direction: 'prev' | 'next'): void {
    if (!this.isReducedMotion && isPlatformBrowser(this.platformId)) {
      this.stopAutoSlide();
    }
    direction === 'prev' ? this.prev() : this.next();
    if (!this.isReducedMotion && isPlatformBrowser(this.platformId)) {
      this.startAutoSlide();
    }
  }

  private updateSliderPosition(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const slider = this.document.querySelector('.slider') as HTMLElement;
    if (slider) {
      slider.style.transform = `translateX(-${this.currentIndex * 100}%)`;
      // Animation du panneau texte
      const captions = this.document.querySelectorAll('.slide-content');
      captions.forEach((c, i) => c.classList.toggle('active', i === this.currentIndex));
    }
  }

  // ================== NAVIGATION ==================
  goToCategory(categoryId: string) {
    this.router.navigate(['customer/tansikprod'], { fragment: categoryId });
  }
  goToEventCategory(categoryId: string) {
    this.router.navigate(['customer/tansikevents'], { fragment: categoryId });
  }
  scrollToSection(id: string): void {
    const el = this.document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  // ================== SEO ==================
  private initializeSeo(): void {
    // Update meta tags
    this.seoService.updateSeoTags({
      title: 'Agence marketing & événementiel à Tunis',
      description: 'Tansik Group réunit Tansik Prod (marketing, design, sites, réseaux sociaux) et Tansik Events (organisation d\'événements). Des services sur mesure, créatifs et efficaces.',
      keywords: 'marketing, événementiel, agence, Tunis, social media, design, site web, Tansik, mariage, séminaire, inauguration',
      image: '/assets/marketing.webp',
      type: 'website'
    });

    // Add structured data
    this.seoService.addOrganizationSchema();
    this.seoService.addWebsiteSchema();
  }

  private refreshJsonLd(): void {
    // Add service list schema when categories are loaded
    if (this.categoriesProd && this.categoriesProd.length > 0) {
      const itemListSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Nos services marketing',
        itemListElement: this.categoriesProd.map((cat: any, idx: number) => ({
          '@type': 'ListItem',
          position: idx + 1,
          url: 'https://www.tansik.tn/customer/tansikprod#' + cat.id,
          name: cat.name
        }))
      };
      this.seoService.addJsonLd(itemListSchema, 'services-list-schema');
    }

    if (this.categoriesEvents && this.categoriesEvents.length > 0) {
      const eventListSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Nos services événementiels',
        itemListElement: this.categoriesEvents.map((cat: any, idx: number) => ({
          '@type': 'ListItem',
          position: idx + 1,
          url: 'https://www.tansik.tn/customer/tansikevents#' + cat.id,
          name: cat.name
        }))
      };
      this.seoService.addJsonLd(eventListSchema, 'events-list-schema');
    }
  }

  // ================== ANIMATIONS D'APPARITION ==================
  private observeAppear(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add('in-view');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });

    this.document.querySelectorAll('.will-appear').forEach(el => observer.observe(el));
  }
}
