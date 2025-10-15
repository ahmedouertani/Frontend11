# 🧪 Testing Angular Universal SSR - Step by Step Guide

## 📋 Pre-Test Checklist

Before testing, ensure:
- ✅ All files saved
- ✅ No compilation errors
- ✅ Backend API running (if needed): http://localhost:8081

---

## 🚀 Test 1: Development Mode with SSR

### Step 1: Start SSR Development Server
```powershell
cd d:\ibtisem\Frontend11
npm run dev:ssr
```

**Expected Output:**
```
✔ Browser application bundle generation complete.
✔ Server application bundle generation complete.
** Angular Live Development Server is listening on localhost:4200 **
```

### Step 2: Open Browser
Visit: http://localhost:4200

### Step 3: Verify SSR is Working
**Method A: View Page Source (Quick Test)**
1. Right-click on the page → "View Page Source" (or press `Ctrl + U`)
2. Look for these indicators:

✅ **GOOD - SSR Working:**
```html
<title>Agence marketing & événementiel à Tunis | Tansik Group</title>
<meta name="description" content="Tansik Group réunit...">
<script type="application/ld+json" id="organization-schema">
  {"@context":"https://schema.org"...}
</script>
<!-- You should see actual content, not just <app-root></app-root> -->
<div class="container">
  <h1>Tansik Group</h1>
  ...
</div>
```

❌ **BAD - SSR Not Working:**
```html
<body>
  <app-root></app-root>
  <!-- Empty, no content rendered -->
</body>
```

**Method B: Network Tab**
1. Open DevTools (`F12`)
2. Go to Network tab
3. Refresh page
4. Click on the first request (document)
5. Check "Response" tab
6. Should see full HTML with content

---

## 🏗️ Test 2: Production Build & Serve

### Step 1: Build for Production
```powershell
npm run build:ssr
```

**Expected Output:**
```
✔ Browser application bundle generation complete.
✔ Copying assets complete.
✔ Server application bundle generation complete.

Output Location: dist/tansik-angular
```

**⏱️ Time:** 1-3 minutes depending on your machine

### Step 2: Check Build Output
```powershell
ls dist\tansik-angular
```

**Expected Files:**
```
browser/     ← Client-side files
server/      ← Server-side files
  server.mjs ← Node.js server
```

### Step 3: Serve Production Build
```powershell
npm run serve:ssr
```

**Expected Output:**
```
Node Express server listening on http://localhost:4000
```

### Step 4: Test Production Version
Visit: http://localhost:4000

**Repeat the same verification as Test 1** (view source, check meta tags)

---

## 🔍 Test 3: SEO Meta Tags Validation

### Test Homepage SEO
1. Visit: http://localhost:4200/home (or :4000 for production)
2. View Page Source (`Ctrl + U`)
3. Search for (`Ctrl + F`):

**✅ Check Title:**
```html
<title>Agence marketing & événementiel à Tunis | Tansik Group</title>
```

**✅ Check Description:**
```html
<meta name="description" content="Tansik Group réunit Tansik Prod...">
```

**✅ Check Open Graph:**
```html
<meta property="og:title" content="Agence marketing...">
<meta property="og:description" content="...">
<meta property="og:image" content="https://www.tansik.tn/assets/marketing.webp">
<meta property="og:url" content="https://www.tansik.tn/">
```

**✅ Check Canonical URL:**
```html
<link rel="canonical" href="https://www.tansik.tn/">
```

**✅ Check Structured Data:**
```html
<script type="application/ld+json" id="organization-schema">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Tansik Group",
  ...
}
</script>
```

---

## 🌐 Test 4: Using Online Tools

### A. Google Rich Results Test
1. **Start your production server:**
   ```powershell
   npm run serve:ssr
   ```

2. **Use ngrok to expose localhost** (if testing from Google):
   ```powershell
   # Install ngrok if you don't have it
   # Download from: https://ngrok.com/download
   
   ngrok http 4000
   ```
   
3. **Copy the ngrok URL** (e.g., https://abc123.ngrok.io)

4. **Visit:** https://search.google.com/test/rich-results

5. **Paste your ngrok URL** and click "Test URL"

6. **Expected Results:**
   - ✅ Organization schema detected
   - ✅ Website schema detected
   - ✅ No errors

### B. Manual curl Test (Windows PowerShell)
```powershell
# Test if meta tags are in the HTML response
curl http://localhost:4000 | Select-String "meta name=`"description`""
```

**Expected Output:**
```
<meta name="description" content="Tansik Group réunit...">
```

### C. Test Different Pages
```powershell
# Test home page
curl http://localhost:4000/home | Select-String "title"

# Test contact pages
curl http://localhost:4000/prodcontact | Select-String "title"
curl http://localhost:4000/eventscontact | Select-String "title"
```

---

## 📱 Test 5: Social Media Preview

### Facebook Sharing Debugger
1. Visit: https://developers.facebook.com/tools/debug/
2. Enter your URL (use ngrok URL if testing locally)
3. Click "Debug"

**Expected Preview:**
- ✅ Title: "Agence marketing & événementiel à Tunis | Tansik Group"
- ✅ Description: Shows your meta description
- ✅ Image: Shows your og:image

### Twitter Card Validator
1. Visit: https://cards-dev.twitter.com/validator
2. Enter your URL
3. Click "Preview card"

**Expected Preview:**
- ✅ Card type: Summary Large Image
- ✅ Title and description visible
- ✅ Image displayed

---

## ⚡ Test 6: Performance & Lighthouse

### Run Lighthouse in Chrome
1. Open http://localhost:4000 in Chrome
2. Press `F12` to open DevTools
3. Click "Lighthouse" tab
4. Select:
   - ✅ Performance
   - ✅ Accessibility  
   - ✅ Best Practices
   - ✅ SEO
5. Click "Analyze page load"

**Expected Scores (Production Build):**
- 🎯 **SEO: 90-100** (this is the most important!)
- 🎯 Performance: 80+ (depends on content)
- 🎯 Accessibility: 85+
- 🎯 Best Practices: 90+

**Key SEO Checks:**
- ✅ Document has a `<title>` element
- ✅ Document has a meta description
- ✅ Page has successful HTTP status code
- ✅ Links are crawlable
- ✅ `robots.txt` is valid

---

## 🐛 Test 7: Check for SSR Errors

### Browser Console (Client-Side)
1. Open DevTools (`F12`)
2. Go to Console tab
3. Refresh page

**✅ Good:** No errors
**⚠️ Warning:** Acceptable warnings (deprecation notices, etc.)
**❌ Bad:** Errors like:
- `window is not defined`
- `localStorage is not defined`
- `document is not defined`

### Server Console (Server-Side)
Check the terminal where you ran `npm run serve:ssr`

**✅ Good Output:**
```
Node Express server listening on http://localhost:4000
```

**❌ Bad Output (Examples):**
```
ERROR: ReferenceError: window is not defined
ERROR: Cannot read property 'localStorage' of undefined
```

If you see server errors, it means some code is trying to use browser APIs during SSR.

---

## 🔧 Test 8: Platform Detection

### Create a Test Component
Create a simple test to verify platform detection works:

```typescript
// In any component
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

ngOnInit() {
  console.log('Is Browser?', isPlatformBrowser(this.platformId));
  
  if (isPlatformBrowser(this.platformId)) {
    console.log('Running in BROWSER');
    console.log('Window available:', typeof window !== 'undefined');
  } else {
    console.log('Running on SERVER (SSR)');
  }
}
```

**Expected Console Output (Browser):**
```
Is Browser? true
Running in BROWSER
Window available: true
```

**Expected Terminal Output (Server during initial render):**
```
Is Browser? false
Running on SERVER (SSR)
```

---

## 📊 Test 9: Compare SSR vs Non-SSR

### Test Without SSR (Regular Build)
```powershell
# Build regular (non-SSR) version
npm run build

# Serve it (you'll need a simple HTTP server)
# Install if you don't have it: npm install -g http-server
npx http-server dist/tansik-angular/browser -p 8080
```

Visit: http://localhost:8080

**View Source:**
- ❌ Should see empty `<app-root></app-root>`
- ❌ Meta tags might be incomplete
- ❌ No content until JavaScript loads

### Test With SSR (Your Current Setup)
```powershell
npm run serve:ssr
```

Visit: http://localhost:4000

**View Source:**
- ✅ Should see full HTML content
- ✅ Complete meta tags
- ✅ Content visible immediately

**This demonstrates the SSR advantage!**

---

## ✅ Success Criteria Checklist

Your SSR implementation is successful if:

- [ ] Development server starts without errors: `npm run dev:ssr`
- [ ] Production build completes: `npm run build:ssr`
- [ ] Production server starts: `npm run serve:ssr`
- [ ] Page source shows full HTML content (not just `<app-root>`)
- [ ] Meta tags are populated with correct values
- [ ] Canonical URL is present
- [ ] JSON-LD structured data is present
- [ ] No console errors about `window` or `document`
- [ ] Lighthouse SEO score is 90+
- [ ] Social media preview shows correct image/title
- [ ] Page loads fast (FCP < 2 seconds)

---

## 🆘 Troubleshooting Common Issues

### Issue 1: "window is not defined"
**Solution:** Code is accessing browser APIs during SSR
```typescript
// Add platform check
if (isPlatformBrowser(this.platformId)) {
  window.scrollTo(0, 0);
}
```

### Issue 2: Build fails
**Solution:** 
```powershell
# Clean and rebuild
rm -r -fo dist
rm -r -fo .angular
npm run build:ssr
```

### Issue 3: Meta tags not updating
**Solution:** 
1. Check if SeoService is injected in component
2. Verify `updateSeoTags()` is called in `ngOnInit()`
3. Clear browser cache and hard refresh (`Ctrl + Shift + R`)

### Issue 4: Structured data not showing
**Solution:**
1. Check page source (not DevTools)
2. Verify `addOrganizationSchema()` is called
3. Use Google Rich Results Test to validate

### Issue 5: Server crashes on start
**Solution:**
```powershell
# Check Node version (should be 18+)
node --version

# Rebuild
npm run build:ssr

# Check for port conflicts
netstat -ano | findstr :4000
```

---

## 🎓 What to Test Next

Once basic SSR is working:

1. **Test all routes:**
   - `/home` ✓
   - `/customer/tansikprod`
   - `/customer/tansikevents`
   - `/prodcontact`
   - `/eventscontact`

2. **Test dynamic pages:**
   - Service detail pages
   - Event detail pages

3. **Test different devices:**
   - Desktop browser
   - Mobile browser
   - Tablet

4. **Test different browsers:**
   - Chrome
   - Firefox
   - Edge
   - Safari

---

## 📈 Monitoring in Production

After deploying to production:

1. **Google Search Console**
   - Submit sitemap
   - Monitor indexing
   - Check coverage reports

2. **Google Analytics**
   - Track page views
   - Monitor load times
   - Check bounce rates

3. **PageSpeed Insights**
   - Regular performance checks
   - Monitor Core Web Vitals

---

**Ready to test? Start with Test 1! 🚀**

Run: `npm run dev:ssr`
