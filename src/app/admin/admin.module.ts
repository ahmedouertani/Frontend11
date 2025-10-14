import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DemoAngularMaterialModule } from '../demo-angular-material/demo-angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PostCategoryComponent } from './components/postCategory/post-category.component';
import { PostProductComponent } from './components/post-product/post-product.component';
import { PostCoponComponent } from './components/post-copon/post-copon.component';
import { CoponsComponent } from './components/copons/copons.component';
import { OrdersComponent } from './components/orders/orders.component';
import { UpdateProductComponent } from './components/update-product/update-product.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { OrderByStatusComponent } from './components/analytics/order-by-status/order-by-status.component';
import { TansikProdComponent } from './tansik-prod/tansik-prod.component';
import { TansikEventsComponent } from './tansik-events/tansik-events.component';
import { PartenairesComponent } from './partenaires/partenaires.component';
import { AjoutPartenaireComponent } from './ajout-partenaire/ajout-partenaire.component';
import { ClientsComponent } from './components/clients/clients.component';
import { UploadImagePrestataireComponent } from './upload-image-prestataire/upload-image-prestataire.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ModifierComptesComponent } from './components/modifier-comptes/modifier-comptes.component';
import { GestionAvisComponent } from './gestion-avis/gestion-avis.component';
import { RendezVousComponent } from './rendez-vous/rendez-vous.component';
import { ServicesComponent } from './tansik-events/services/services.component';
import { CommandEventsComponent } from './tansik-events/command-events/command-events.component';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { NgChartsModule } from 'ng2-charts';
import { AjouterMediaComponent } from './ajouter-media/ajouter-media.component';
import { ContactComponent } from './components/contact/contact.component';
import { CollabComponent } from './collab/collab.component';
import { AddPostComponent } from './components/add-post/add-post.component';
import { PostDetailsComponent } from './components/post-details/post-details.component';



@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    PostCategoryComponent,
    PostProductComponent,
    PostCoponComponent,
    CoponsComponent,
    OrdersComponent,
    UpdateProductComponent,
    AnalyticsComponent,
    OrderByStatusComponent,
    TansikProdComponent,
    TansikEventsComponent,
    PartenairesComponent,
    AjoutPartenaireComponent,
    ClientsComponent,
    UploadImagePrestataireComponent,
    ModifierComptesComponent,
    GestionAvisComponent,
    RendezVousComponent,
    ServicesComponent,
    CommandEventsComponent,
    NewsletterComponent,
    AjouterMediaComponent,
    ContactComponent,
    AddPostComponent,
    PostDetailsComponent,
    


  ],
  imports: [
    CommonModule,
    AdminRoutingModule,   
     DemoAngularMaterialModule,
        FormsModule,
        ReactiveFormsModule ,
        HttpClientModule,
        MatChipsModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule, 
        NgChartsModule,
        MatSelectModule,
      

        
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminModule { }
