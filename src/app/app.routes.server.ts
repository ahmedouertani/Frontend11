import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Server routes configuration for Angular Universal
 * Configure which pages should be pre-rendered, server-rendered, or client-rendered
 */
export const serverRoutes: ServerRoute[] = [
  // Home page - Prerender for best SEO
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'home',
    renderMode: RenderMode.Prerender
  },

  // Public pages - Prerender for SEO
  {
    path: 'prodcontact',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'eventscontact',
    renderMode: RenderMode.Prerender
  },

  // Main service pages - Server-side render for dynamic content
  {
    path: 'customer/tansikprod',
    renderMode: RenderMode.Server
  },
  {
    path: 'customer/tansikevents',
    renderMode: RenderMode.Server
  },

  // Service detail pages - Server-side render for SEO with dynamic content
  {
    path: 'customer/service/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'customer/event/:id',
    renderMode: RenderMode.Server
  },

  // Login - Client-side only (no SEO needed, user-specific)
  {
    path: 'logins',
    renderMode: RenderMode.Client
  },

  // Catch-all for admin, prestataire, and authenticated customer routes
  // These don't need SEO, so render on client-side only
  {
    path: 'admin/**',
    renderMode: RenderMode.Client
  },
  {
    path: 'prestataire/**',
    renderMode: RenderMode.Client
  },
  {
    path: 'customer/dashboard',
    renderMode: RenderMode.Client
  },
  {
    path: 'customer/cart',
    renderMode: RenderMode.Client
  },
  {
    path: 'customer/wishlist',
    renderMode: RenderMode.Client
  },
  {
    path: 'customer/my-orders',
    renderMode: RenderMode.Client
  },
  {
    path: 'customer/profile',
    renderMode: RenderMode.Client
  },
  {
    path: 'customer/place-order-events',
    renderMode: RenderMode.Client
  },

  // Default: Server-side render for any other routes
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
