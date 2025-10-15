import { Injectable, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { filter } from 'rxjs/operators';

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly siteName = 'Tansik Group';
  private readonly baseUrl = 'https://www.tansik.tn'; // ⚠️ Update to your production domain
  private readonly defaultImage = '/assets/logogroup.webp';
  private readonly defaultDescription = 'Tansik Group - Agence de marketing et événementiel à Tunis. Organisation complète de mariages, séminaires, inaugurations et événements corporate.';

  constructor(
    private title: Title,
    private meta: Meta,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.initializeRouterEvents();
  }

  /**
   * Listen to route changes and update canonical URL
   */
  private initializeRouterEvents(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateCanonicalUrl(event.urlAfterRedirects);
      });
  }

  /**
   * Update all SEO meta tags
   */
  updateSeoTags(config: SeoConfig): void {
    const fullTitle = config.title.includes(this.siteName)
      ? config.title
      : `${config.title} | ${this.siteName}`;

    const imageUrl = config.image || this.defaultImage;
    const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : this.baseUrl + imageUrl;
    const fullUrl = config.url || this.baseUrl + this.router.url;

    // Update title
    this.title.setTitle(fullTitle);

    // Basic meta tags
    this.meta.updateTag({ name: 'description', content: config.description });
    this.meta.updateTag({ name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large' });

    if (config.keywords) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords });
    }

    if (config.author) {
      this.meta.updateTag({ name: 'author', content: config.author });
    }

    // Open Graph
    this.meta.updateTag({ property: 'og:type', content: config.type || 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:url', content: fullUrl });
    this.meta.updateTag({ property: 'og:image', content: fullImageUrl });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({ property: 'og:locale', content: 'fr_FR' });

    if (config.publishedTime) {
      this.meta.updateTag({ property: 'article:published_time', content: config.publishedTime });
    }
    if (config.modifiedTime) {
      this.meta.updateTag({ property: 'article:modified_time', content: config.modifiedTime });
    }

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: fullImageUrl });
    this.meta.updateTag({ name: 'twitter:site', content: '@tansikgroup' }); // Update with your Twitter handle

    // Update canonical URL
    this.updateCanonicalUrl(this.router.url);
  }

  /**
   * Update canonical URL
   */
  private updateCanonicalUrl(url: string): void {
    const head = this.document.head;
    let link: HTMLLinkElement | null = head.querySelector('link[rel="canonical"]');

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      head.appendChild(link);
    }

    const canonicalUrl = this.baseUrl + url.split('?')[0].split('#')[0];
    link.setAttribute('href', canonicalUrl);
  }

  /**
   * Add JSON-LD structured data
   */
  addJsonLd(data: any, id?: string): void {
    const scriptId = id || 'jsonld-script';
    const head = this.document.head;

    // Remove existing script with same ID
    const existingScript = head.querySelector(`script#${scriptId}`);
    if (existingScript) {
      existingScript.remove();
    }

    // Create new script
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.id = scriptId;
    script.text = JSON.stringify(data);
    head.appendChild(script);
  }

  /**
   * Remove JSON-LD structured data
   */
  removeJsonLd(id: string): void {
    const script = this.document.head.querySelector(`script#${id}`);
    if (script) {
      script.remove();
    }
  }

  /**
   * Add Organization schema
   */
  addOrganizationSchema(): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Tansik Group',
      url: this.baseUrl,
      logo: this.baseUrl + '/assets/logogroup.webp',
      description: this.defaultDescription,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Tunis',
        addressCountry: 'TN'
      },
      sameAs: [
        'https://www.facebook.com/tansik.production?locale=fr_FR',
        'https://www.instagram.com/tansik_prod/?hl=fr'
      ],
      foundingDate: '2023-01',
      department: [
        {
          '@type': 'Organization',
          name: 'Tansik Prod',
          url: this.baseUrl + '/customer/tansikprod',
          logo: this.baseUrl + '/assets/logoprod.webp',
          description: 'Marketing digital, design graphique, gestion des réseaux sociaux'
        },
        {
          '@type': 'Organization',
          name: 'Tansik Events',
          url: this.baseUrl + '/customer/tansikevents',
          logo: this.baseUrl + '/assets/logoevents.webp',
          description: 'Organisation d\'événements : mariages, séminaires, inaugurations'
        }
      ]
    };

    this.addJsonLd(schema, 'organization-schema');
  }

  /**
   * Add Website schema with search action
   */
  addWebsiteSchema(): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: this.siteName,
      url: this.baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: this.baseUrl + '/recherche?q={search_term_string}'
        },
        'query-input': 'required name=search_term_string'
      }
    };

    this.addJsonLd(schema, 'website-schema');
  }

  /**
   * Add Service schema
   */
  addServiceSchema(service: any): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.name,
      description: service.description,
      provider: {
        '@type': 'Organization',
        name: 'Tansik Group'
      },
      areaServed: {
        '@type': 'Country',
        name: 'Tunisia'
      },
      offers: {
        '@type': 'Offer',
        price: service.price,
        priceCurrency: 'TND',
        availability: 'https://schema.org/InStock'
      }
    };

    if (service.image) {
      schema['image'] = service.image;
    }

    this.addJsonLd(schema, 'service-schema');
  }

  /**
   * Add Breadcrumb schema
   */
  addBreadcrumbSchema(items: Array<{ name: string; url: string }>): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: this.baseUrl + item.url
      }))
    };

    this.addJsonLd(schema, 'breadcrumb-schema');
  }

  /**
   * Add Event schema
   */
  addEventSchema(event: any): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: event.name,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.location ? {
        '@type': 'Place',
        name: event.location.name,
        address: event.location.address
      } : undefined,
      organizer: {
        '@type': 'Organization',
        name: 'Tansik Events',
        url: this.baseUrl + '/customer/tansikevents'
      },
      image: event.image ? [event.image] : undefined
    };

    this.addJsonLd(schema, 'event-schema');
  }
}
