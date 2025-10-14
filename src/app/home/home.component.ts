import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

import { CustomerService } from '../customer/services/customer.service';
import { AdminService } from '../admin/service/admin.service';
import { CollabService, Collab } from '../services/collab.service';

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

  // ------- SEO -------
  private siteName = 'Tansik Group';
  private baseUrl = 'https://www.tansik.tn'; // ⚠️ mets ton domaine prod
  private pagePath = '/';
  private pageTitle = 'Agence marketing & événementiel à Tunis | Tansik Group';
  private pageDescription = 'Tansik Group réunit Tansik Prod (marketing, design, sites, réseaux sociaux) et Tansik Events (organisation d’événements). Des services sur mesure, créatifs et efficaces.';
  private pageImage = this.baseUrl + '/assets/marketing.webp'; // idéal 1200x630

  constructor(
    private customerService: CustomerService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    private adminService: AdminService,
    private collabService: CollabService,
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  // ================== CYCLE DE VIE ==================
  ngOnInit(): void {
    // Motion settings
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.isReducedMotion) this.autoSlideDelay = 0;

    this.loadData();
    this.loadCollabs();
    if (!this.isReducedMotion) this.startAutoSlide();

    // SEO initial
    this.setSeoTags();
    this.setCanonical();
    this.injectJsonLd();

    // IO pour animations d’apparition
    this.observeAppear();
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
    if (this.autoSlideDelay <= 0) return;
    this.stopAutoSlide();
    this.intervalId = setInterval(() => this.next(), this.autoSlideDelay);
  }

  stopAutoSlide(): void {
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
    if (!this.isReducedMotion) this.startAutoSlide();
  }

  handleButtonClick(direction: 'prev' | 'next'): void {
    if (!this.isReducedMotion) this.stopAutoSlide();
    direction === 'prev' ? this.prev() : this.next();
    if (!this.isReducedMotion) this.startAutoSlide();
  }

  private updateSliderPosition(): void {
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
  private setSeoTags(): void {
    this.title.setTitle(this.pageTitle);

    this.meta.updateTag({ name: 'description', content: this.pageDescription });
    this.meta.updateTag({ name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' });
    this.meta.updateTag({ name: 'keywords', content: 'marketing, événementiel, agence, Tunis, social media, design, site web, Tansik' });

    // Open Graph
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });
    this.meta.updateTag({ property: 'og:title', content: this.pageTitle });
    this.meta.updateTag({ property: 'og:description', content: this.pageDescription });
    this.meta.updateTag({ property: 'og:url', content: this.baseUrl + this.pagePath });
    this.meta.updateTag({ property: 'og:image', content: this.pageImage });

    // Twitter
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: this.pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: this.pageDescription });
    this.meta.updateTag({ name: 'twitter:image', content: this.pageImage });
  }

  private setCanonical(): void {
    const head = this.document.head;
    const existing = head.querySelector('link[rel="canonical"]');
    if (existing) existing.remove();

    const link: HTMLLinkElement = this.document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', this.baseUrl + this.pagePath);
    head.appendChild(link);
  }

  private injectJsonLd(): void {
    const head = this.document.head;
    head.querySelectorAll('script[type="application/ld+json"].home-jsonld').forEach(s => s.remove());

    const org = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Tansik Group',
      url: this.baseUrl,
      logo: this.baseUrl + '/assets/logogroup.webp',
      sameAs: [
        'https://www.facebook.com/tansik.production?locale=fr_FR',
        'https://www.instagram.com/tansik_prod/?hl=fr'
      ],
      department: [
        { '@type': 'Organization', name: 'Tansik Prod', url: this.baseUrl + '/customer/tansikprod', logo: this.baseUrl + '/assets/logoprod.webp' },
        { '@type': 'Organization', name: 'Tansik Events', url: this.baseUrl + '/customer/tansikevents', logo: this.baseUrl + '/assets/logoevents.webp' }
      ]
    };

    const website = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: this.siteName,
      url: this.baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: this.baseUrl + '/recherche?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    };

    const itemList = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Nos services',
      itemListElement: this.categoriesProd?.map((cat: any, idx: number) => ({
        '@type': 'ListItem', position: idx + 1,
        url: this.baseUrl + '/customer/tansikprod#' + cat.id, name: cat.name
      })) || []
    };

    [org, website, itemList].forEach(json => {
      const script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.classList.add('home-jsonld');
      script.text = JSON.stringify(json);
      head.appendChild(script);
    });
  }

  private refreshJsonLd(): void {
    this.injectJsonLd();
  }

  // ================== ANIMATIONS D’APPARITION ==================
  private observeAppear(): void {
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
