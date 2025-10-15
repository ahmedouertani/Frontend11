# 🚀 Quick Start: Angular Universal SSR

## Running the Application

### Development (with SSR)
```bash
npm run dev:ssr
```
Visit: http://localhost:4200

### Production Build
```bash
npm run build:ssr
```

### Test Production Build Locally
```bash
npm run serve:ssr
```
Visit: http://localhost:4000

---

## Common SSR Errors & Solutions

### ❌ Error: `window is not defined`
**Problem**: Accessing `window` object on server
**Solution**:
```typescript
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

// Safe access
if (isPlatformBrowser(this.platformId)) {
  window.scrollTo(0, 0);
}

// Or use PlatformService
import { PlatformService } from './services/platform.service';

constructor(private platform: PlatformService) {}

this.platform.runInBrowser(() => {
  window.scrollTo(0, 0);
});
```

### ❌ Error: `localStorage is not defined`
**Problem**: Accessing localStorage on server
**Solution**: Already fixed in `UserStorageService`
```typescript
// UserStorageService already handles this
UserStorageService.getToken(); // Returns null on server
```

### ❌ Error: `document is not defined`
**Problem**: Accessing DOM on server
**Solution**:
```typescript
import { DOCUMENT } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

constructor(
  @Inject(DOCUMENT) private document: Document,
  @Inject(PLATFORM_ID) private platformId: Object
) {}

if (isPlatformBrowser(this.platformId)) {
  const element = this.document.getElementById('myId');
}
```

### ❌ Error: Third-party library not SSR compatible
**Solution**: Lazy load in browser only
```typescript
ngOnInit() {
  if (isPlatformBrowser(this.platformId)) {
    import('your-library').then(lib => {
      // Use library
    });
  }
}
```

---

## Adding SEO to a Component

### Step 1: Import SeoService
```typescript
import { SeoService } from '../services/seo.service';

constructor(private seoService: SeoService) {}
```

### Step 2: Update Meta Tags in ngOnInit
```typescript
ngOnInit() {
  this.seoService.updateSeoTags({
    title: 'Page Title',
    description: 'Page description for SEO',
    keywords: 'keyword1, keyword2, keyword3',
    image: '/assets/page-image.webp',
    type: 'website'
  });
}
```

### Step 3: Add Structured Data (Optional)
```typescript
// For services
this.seoService.addServiceSchema({
  name: 'Service Name',
  description: 'Service description',
  price: 100,
  image: 'image-url'
});

// For events
this.seoService.addEventSchema({
  name: 'Event Name',
  description: 'Event description',
  startDate: '2025-12-01',
  endDate: '2025-12-02'
});

// For breadcrumbs
this.seoService.addBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'Services', url: '/services' },
  { name: 'Current Page', url: '/services/detail' }
]);
```

---

## Platform Detection Cheat Sheet

```typescript
import { PlatformService } from './services/platform.service';

constructor(private platform: PlatformService) {}

// Check platform
if (this.platform.isBrowser()) { /* ... */ }
if (this.platform.isServer()) { /* ... */ }

// Run only in browser
this.platform.runInBrowser(() => {
  console.log('Browser only');
});

// Safe access to browser APIs
const win = this.platform.getWindow();
const doc = this.platform.getDocument();
const storage = this.platform.getLocalStorage();
```

---

## Testing SSR

### 1. Check if SSR is working
```bash
npm run build:ssr
npm run serve:ssr
```

Open http://localhost:4000 and view page source (Ctrl+U)
- ✅ Should see full HTML content
- ✅ Should see meta tags filled
- ✅ Should NOT see just `<app-root></app-root>`

### 2. Test with curl
```bash
curl http://localhost:4000 | grep "meta name=\"description\""
```
Should return meta tag with description

### 3. Google Rich Results Test
https://search.google.com/test/rich-results
- Paste your URL
- Check for structured data

---

## Render Modes Explained

### Prerender (Static)
```typescript
{ path: 'home', renderMode: RenderMode.Prerender }
```
- ✅ Best SEO
- ✅ Fastest load time
- ✅ Use for: home, contact, about pages
- ❌ Can't use dynamic data

### Server (SSR)
```typescript
{ path: 'service/:id', renderMode: RenderMode.Server }
```
- ✅ Good SEO
- ✅ Dynamic content
- ✅ Use for: product pages, blog posts
- ⚠️ Slower than prerender

### Client (CSR)
```typescript
{ path: 'admin/**', renderMode: RenderMode.Client }
```
- ❌ No SEO
- ✅ Full client-side features
- ✅ Use for: dashboards, authenticated pages

---

## Deployment Checklist

### Before Deploying
- [ ] Test SSR locally: `npm run serve:ssr`
- [ ] View page source - check meta tags
- [ ] Test on mobile device
- [ ] Check console for errors
- [ ] Run Lighthouse audit
- [ ] Validate structured data

### Update Production URLs
1. `src/app/services/seo.service.ts`
   ```typescript
   private readonly baseUrl = 'https://your-domain.com';
   ```

2. `public/robots.txt`
   ```
   Sitemap: https://your-domain.com/sitemap.xml
   ```

3. `public/sitemap.xml`
   ```xml
   <loc>https://your-domain.com/page</loc>
   ```

### Deploy
1. Build: `npm run build:ssr`
2. Upload `dist/tansik-angular/` to server
3. Run: `node dist/tansik-angular/server/server.mjs`
4. Configure reverse proxy (Nginx/Apache)

---

## Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Cache static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## Performance Tips

### 1. Image Optimization
- Use WebP format
- Compress images (< 200KB)
- Add `loading="lazy"` attribute
- Serve different sizes for mobile/desktop

### 2. Reduce Bundle Size
- Use lazy loading for routes
- Remove unused imports
- Analyze bundle: `npm run build:ssr -- --stats-json`

### 3. Caching Strategy
- Cache static assets (1 year)
- Cache API responses (when appropriate)
- Use service worker for offline support

---

## Need Help?

1. Check `SEO-IMPLEMENTATION.md` for detailed guide
2. Review `src/app/services/seo.service.ts`
3. Check Angular SSR docs: https://angular.dev/guide/ssr
4. Search GitHub issues: https://github.com/angular/angular/issues

---

**Last Updated**: October 15, 2025
