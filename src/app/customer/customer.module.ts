import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatTooltipModule } from '@angular/material/tooltip';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule, MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCheckboxModule } from '@angular/material/checkbox';

// Routing
import { CustomerRoutingModule } from './customer-routing.module';

// Composants
import { CustomerComponent } from './customer.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CartComponent } from './components/dashboard/cart/cart.component';
import { PlaceOrderComponent } from './components/dashboard/place-order/place-order.component';
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
import { TansikprodComponent } from './tansikprod/tansikprod.component';

// Partenaires
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
import { MatSpinner } from '@angular/material/progress-spinner';
import { ProfilecardComponent } from './components/profilecard/profilecard.component';
import { LazyLoadDirective } from '../directives/lazy-load.directive';
import { TansikEventsComponent } from '../admin/tansik-events/tansik-events.component';
import { TansikeventsComponent } from './tansikevents/tansikevents.component';
import { PromotionsComponent } from './promotions/promotions.component';
import { PostsComponent } from './components/posts/posts.component';
import { TansikProdLayoutComponent } from './layouts/tansik-prod-layout/tansik-prod-layout.component';
import { TansikEventsLayoutComponent } from './layouts/tansik-events-layout/tansik-events-layout.component';

@NgModule({
  declarations: [
    CustomerComponent,
    DashboardComponent,
    CartComponent,
    PlaceOrderComponent,
    MyOrdersComponent,
    ViewOrderedProductsComponent,
    ReviewOrderedProductComponent,
    ViewProductDetailComponent,
    ViewWishlistComponent,
    ProfileComponent,
    PlaceOrderEventsComponent,
    EventsComponent,
    ProdComponent,
    RendezVousClientComponent,
    RendezVousComponent,
    NewsletterComponent,
    ViewEventDetailComponent,
    TansikprodComponent,
    CheersComponent,
    DarmarwaComponent,
    GreenlandComponent,
    InnovasComponent,
    LedouceurComponent,
    OmegaComponent,
    ParakhouloudComponent,
    SpicelandComponent,
    WahraComponent,
    RendezvousprodComponent,
    ProfilecardComponent,
    LazyLoadDirective,
    TansikeventsComponent,
    PromotionsComponent,
    PostsComponent,
    TansikProdLayoutComponent,
    TansikEventsLayoutComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    // Angular Material
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTableModule,
    MatSelectModule,
    MatOptionModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatToolbarModule,
    MatChipsModule,
    MatMenuModule,
    MatExpansionModule,
    MatGridListModule,
    MatCheckboxModule,
    MatSpinner,
    ClipboardModule,
    MatTooltipModule

  ]
})
export class CustomerModule {}
