import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './customer.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CartComponent } from './components/dashboard/cart/cart.component';
import { MyOrdersComponent } from './components/dashboard/my-orders/my-orders.component';
import { ViewOrderedProductsComponent } from './components/view-ordered-products/view-ordered-products.component';
import { ReviewOrderedProductComponent } from './components/review-ordered-product/review-ordered-product.component';
import { ViewProductDetailComponent } from './components/view-product-detail/view-product-detail.component';
import { ViewWishlistComponent } from './components/view-wishlist/view-wishlist.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PlaceOrderEventsComponent } from './components/place-order-events/place-order-events.component';
import { EventsComponent } from './components/dashboard/events/events.component';
import { ProdComponent } from './components/prod/prod.component';
import { RendezVousClientComponent } from './components/rendez-vous-client/rendez-vous-client.component';
import { RendezVousComponent } from './components/rendez-vous/rendez-vous.component';
import { NewsletterComponent } from './components/newsletter/newsletter.component';
import { ViewEventDetailComponent } from './components/view-event-detail/view-event-detail.component';
import { ClientAuthGuard } from '../guards/client-auth.guard';
import { TansikprodComponent } from './tansikprod/tansikprod.component';
import { TansikeventsComponent } from './tansikevents/tansikevents.component';
import { CheersComponent } from './partners/cheers/cheers.component';
import { DarmarwaComponent } from './partners/darmarwa/darmarwa.component';
import { GreenlandComponent } from './partners/greenland/greenland.component';
import { InnovasComponent } from './partners/innovas/innovas.component';
import { LedouceurComponent } from './partners/ledouceur/ledouceur.component';
import { OmegaComponent } from './partners/omega/omega.component';
import { ParakhouloudComponent } from './partners/parakhouloud/parakhouloud.component';
import { SpicelandComponent } from './partners/spiceland/spiceland.component';
import { WahraComponent } from './partners/wahra/wahra.component';
import { RendezvousprodComponent } from './rendezvousprod/rendezvousprod.component';
import { ProfilecardComponent } from './components/profilecard/profilecard.component';
import { PromotionsComponent } from './promotions/promotions.component';
import { PostsComponent } from './components/posts/posts.component';
import { PostDetailsComponent } from '../admin/components/post-details/post-details.component';

const routes: Routes = [
  { path: '', component: CustomerComponent, canActivate: [ClientAuthGuard] },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'cart', component: CartComponent, canActivate: [ClientAuthGuard] },
  { path: 'my-orders', component: MyOrdersComponent, canActivate: [ClientAuthGuard] },
  { path: 'ordered-products/:orderId', component: ViewOrderedProductsComponent, canActivate: [ClientAuthGuard] },
  { path: 'review', component: ReviewOrderedProductComponent, canActivate: [ClientAuthGuard] },
  { path: 'service/:prodId', component: ViewProductDetailComponent },
  { path: 'wishlist', component: ViewWishlistComponent, canActivate: [ClientAuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [ClientAuthGuard] },
  { path: 'events', component: EventsComponent },
  { path: 'prod', component: ProdComponent },
  { path: 'rendez-vous-client', component: RendezVousClientComponent, canActivate: [ClientAuthGuard] },
  { path: 'rendez-vous', component: RendezVousComponent },
  { path: 'newsletter', component: NewsletterComponent , canActivate: [ClientAuthGuard] },
  { path: 'place-order-events', component: PlaceOrderEventsComponent, canActivate: [ClientAuthGuard] },
  { path: 'event/:eventId', component: ViewEventDetailComponent },
  { path: 'tansikevents', component: TansikeventsComponent },
  { path: 'tansikprod', component: TansikprodComponent },
  { path: 'client/cheers', component: CheersComponent },
  { path: 'client/darmarwa', component: DarmarwaComponent },
  { path: 'client/greenland', component: GreenlandComponent },
  { path: 'client/innovass', component: InnovasComponent },
  { path: 'client/douceur', component: LedouceurComponent },
  { path: 'client/omega', component: OmegaComponent },
  { path: 'client/parakhouloud', component: ParakhouloudComponent },
  { path: 'client/spiceland', component: SpicelandComponent },
  { path: 'client/wahra', component: WahraComponent },
  { path: 'rendezvous', component: RendezvousprodComponent },
  { path: 'profilecard', component: ProfilecardComponent },
  { path: 'promotions', component: PromotionsComponent },
    { path: 'blog', component: PostsComponent },
 {path: 'admin/posts/:id', component: PostDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }