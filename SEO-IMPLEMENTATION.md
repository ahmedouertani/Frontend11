# 📊 SEO Implementation Guide - Tansik Group

## ✅ What Has Been Implemented

### 1. **Angular Universal (SSR) Configuration**
- ✅ Server-Side Rendering enabled
- ✅ Hybrid rendering modes configured:
  - **Prerender**: Static pages (home, contact) for best SEO
  - **Server**: Dynamic pages (services, events) for SEO + dynamic content
  - **Client**: Authenticated pages (admin, dashboard) no SEO needed

### 2. **SEO Service** (`src/app/services/seo.service.ts`)
A centralized service to manage all SEO aspects:
- ✅ Dynamic meta tags (title, description, keywords)
- ✅ Open Graph tags (Facebook sharing)
- ✅ Twitter Card tags (Twitter sharing)
- ✅ Canonical URLs (prevent duplicate content)
- ✅ JSON-LD structured data (Schema.org)

**How to use in any component:**

```typescript
import { SeoService } from '../services/seo.service';

constructor(private seoService: SeoService) {}

ngOnInit() {
  // Update meta tags
  this.seoService.updateSeoTags({
    title: 'Your Page Title',
    description: 'Your page description',
    keywords: 'keyword1, keyword2, keyword3',
    image: '/assets/your-image.webp',
    type: 'website' // or 'article', 'product', etc.
  });

  // Add structured data
  this.seoService.addOrganizationSchema();
}
```

### 3. **Structured Data (Schema.org JSON-LD)**
Implemented schemas:
- ✅ **Organization**: Company information
- ✅ **WebSite**: Site-wide search action
- ✅ **Service**: Individual services
- ✅ **Event**: Events organization
- ✅ **Breadcrumb**: Navigation path
- ✅ **ItemList**: Service/product listings

### 4. **SSR-Safe Code**
Fixed browser-only APIs:
- ✅ `UserStorageService`: Platform detection for localStorage
- ✅ `HomeComponent`: Platform detection for DOM manipulation
- ✅ All components check `isPlatformBrowser` before using `window`, `document`, etc.

### 5. **SEO Files**
- ✅ `robots.txt`: Search engine crawler instructions
- ✅ `sitemap.xml`: Site structure for search engines
- ✅ Optimized `index.html`: Meta tags, preconnect, structured markup

### 6. **Performance Optimizations**
- ✅ Preconnect to external resources (fonts, CDNs)
- ✅ Lazy loading for routes
- ✅ Image optimization hints
- ✅ Event replay for hydration (smooth transition from SSR to client)

---

## 🚀 How to Build & Deploy for Production

### Development with SSR
```bash
npm run dev:ssr
```
This runs the app with Server-Side Rendering locally.

### Build for Production
```bash
npm run build:ssr
```
This creates:
- `dist/tansik-angular/browser/` - Client-side files
- `dist/tansik-angular/server/` - Server-side files

### Serve Production Build Locally
```bash
npm run serve:ssr
```
Then visit: http://localhost:4000

### Deploy to Production
1. Upload both `browser/` and `server/` folders to your server
2. Run the Node.js server:
   ```bash
   node dist/tansik-angular/server/server.mjs
   ```
3. Configure your web server (Nginx/Apache) to proxy to Node.js

---

## 📝 Adding SEO to New Components

### Example: Service Detail Page

```typescript
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { SeoService } from '../services/seo.service';
import { AdminService } from '../admin/service/admin.service';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  standalone: false
})
export class ServiceDetailComponent implements OnInit {
  service: any;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private seoService: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    const serviceId = this.route.snapshot.params['id'];
    
    this.adminService.getProductById(serviceId).subscribe(service => {
      this.service = service;
      
      // SEO: Update meta tags
      this.seoService.updateSeoTags({
        title: service.name,
        description: service.description,
        keywords: `${service.name}, ${service.categoryName}, Tansik`,
        image: service.base64Img ? `data:image/jpeg;base64,${service.base64Img}` : '/assets/default-service.jpg',
        type: 'product'
      });

      // SEO: Add structured data
      this.seoService.addServiceSchema({
        name: service.name,
        description: service.description,
        price: service.price,
        image: service.base64Img ? `data:image/jpeg;base64,${service.base64Img}` : null
      });

      // SEO: Add breadcrumb
      this.seoService.addBreadcrumbSchema([
        { name: 'Accueil', url: '/' },
        { name: 'Services', url: '/customer/tansikprod' },
        { name: service.name, url: `/customer/service/${serviceId}` }
      ]);
    });
  }
}
```

---

## 🔍 Testing Your SEO

### 1. **Check Server-Side Rendering**
View page source (Ctrl+U) in browser. You should see:
- ✅ Full HTML content (not just `<app-root>`)
- ✅ Meta tags populated
- ✅ JSON-LD scripts present

### 2. **Google Rich Results Test**
https://search.google.com/test/rich-results
- Paste your URL
- Check for structured data errors

### 3. **Facebook Sharing Debugger**
https://developers.facebook.com/tools/debug/
- Test Open Graph tags
- Preview how links appear when shared

### 4. **Twitter Card Validator**
https://cards-dev.twitter.com/validator
- Test Twitter Card tags
- Preview Twitter sharing appearance

### 5. **PageSpeed Insights**
https://pagespeed.web.dev/
- Check performance scores
- SSR should significantly improve FCP (First Contentful Paint)

### 6. **Lighthouse (Chrome DevTools)**
```
F12 → Lighthouse → Analyze page
```
Check scores for:
- Performance
- Accessibility
- Best Practices
- **SEO** ← Should be 90+

---

## 🎯 SEO Best Practices for Content

### Page Titles
- ✅ Unique for each page
- ✅ 50-60 characters max
- ✅ Include brand name: "Service Name | Tansik Group"
- ✅ Front-load keywords

### Meta Descriptions
- ✅ Unique for each page
- ✅ 150-160 characters max
- ✅ Include call-to-action
- ✅ Summarize page value

### Keywords
- ✅ Focus on 3-5 main keywords per page
- ✅ Use long-tail keywords: "organisation mariage Tunis"
- ✅ Natural language, not keyword stuffing

### Images
- ✅ Use WebP format (smaller, faster)
- ✅ Add `alt` attributes: `alt="Organisation mariage luxueux Tunis"`
- ✅ Compress images (< 200KB)
- ✅ Use lazy loading: `loading="lazy"`

### URLs
- ✅ Clean, descriptive URLs
- ✅ Use hyphens, not underscores: `/customer/tansik-events`
- ✅ Lowercase only
- ✅ Short and meaningful

---

## 🔧 Maintenance Tasks

### Update Sitemap
When adding new services/events:
1. Edit `public/sitemap.xml`
2. Add new URLs
3. Update `<lastmod>` date
4. Submit to Google Search Console

### Monitor Performance
**Monthly:**
- Check Google Search Console
- Review PageSpeed Insights
- Update outdated content

**Quarterly:**
- Audit broken links
- Update meta descriptions
- Refresh structured data

---

## 🌍 Localization (Future Enhancement)

To add multilingual SEO:
```typescript
// Update SeoService for language
this.seoService.updateSeoTags({
  title: 'Your Title',
  description: 'Your description',
  // ... other fields
});

// Add hreflang tags
<link rel="alternate" hreflang="fr" href="https://www.tansik.tn/fr/page">
<link rel="alternate" hreflang="en" href="https://www.tansik.tn/en/page">
<link rel="alternate" hreflang="ar" href="https://www.tansik.tn/ar/page">
```

---

## 📞 Support & Resources

### Documentation
- [Angular Universal Guide](https://angular.dev/guide/ssr)
- [Schema.org Documentation](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)

### Contact
For SEO questions specific to this implementation:
- Check this guide first
- Review `src/app/services/seo.service.ts`
- Test in development: `npm run dev:ssr`

---

## ✨ Next Steps

1. **Test SSR locally**: `npm run dev:ssr`
2. **Build for production**: `npm run build:ssr`
3. **Add SEO to remaining components** (use examples above)
4. **Generate dynamic sitemap** (backend service to update sitemap.xml)
5. **Submit sitemap to Google**: https://search.google.com/search-console
6. **Monitor results** in Google Analytics & Search Console

---

**Last Updated**: October 15, 2025
**Project**: Tansik Group Angular Application
**Version**: Angular 19.2.0 with SSR
