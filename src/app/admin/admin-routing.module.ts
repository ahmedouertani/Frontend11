import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PostCategoryComponent } from './components/postCategory/post-category.component';
import { PostProductComponent } from './components/post-product/post-product.component';
import { PostCoponComponent } from './components/post-copon/post-copon.component';
import { CoponsComponent } from './components/copons/copons.component';
import { OrdersComponent } from './components/orders/orders.component';
import { UpdateProductComponent } from './components/update-product/update-product.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { TansikProdComponent } from './tansik-prod/tansik-prod.component';
import { TansikEventsComponent } from './tansik-events/tansik-events.component';
import { PartenairesComponent } from './partenaires/partenaires.component';
import { AjoutPartenaireComponent } from './ajout-partenaire/ajout-partenaire.component';
import { ClientsComponent } from './components/clients/clients.component';
import { UploadImagePrestataireComponent } from './upload-image-prestataire/upload-image-prestataire.component';
import { ModifierComptesComponent } from './components/modifier-comptes/modifier-comptes.component';
import { GestionAvisComponent } from './gestion-avis/gestion-avis.component';
import { AdminAuthGuard } from '../guards/admin-auth.guard';
import { RendezVousComponent } from './rendez-vous/rendez-vous.component';
import { CommandEventsComponent } from './tansik-events/command-events/command-events.component';
import { ServicesComponent } from './tansik-events/services/services.component';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { AjouterMediaComponent } from './ajouter-media/ajouter-media.component';
import { ContactComponent } from './components/contact/contact.component';
import { CollabComponent } from './collab/collab.component';
import { CollabDetailComponent } from '../collab-detail/collab-detail.component';
import { AddPostComponent } from './components/add-post/add-post.component';
import { PostDetailsComponent } from './components/post-details/post-details.component';



const routes: Routes = [
  { path: '', component: AdminComponent ,
    canActivate: [AdminAuthGuard]},
  { path: 'dashboard', component: DashboardComponent,
    canActivate: [AdminAuthGuard] },
  { path: 'category', component: PostCategoryComponent ,
    canActivate: [AdminAuthGuard]},
  { path: 'product', component: PostProductComponent ,
    canActivate: [AdminAuthGuard]},
  { path: 'update-product/:serviceId', component: UpdateProductComponent ,
    canActivate: [AdminAuthGuard]},
  { path: 'post-copon', component: PostCoponComponent ,
    canActivate: [AdminAuthGuard]},
  { path: 'copons', component: CoponsComponent ,
    canActivate: [AdminAuthGuard]},
  { path: 'orders', component: OrdersComponent ,
    canActivate: [AdminAuthGuard]},
  { path: 'analytics', component: AnalyticsComponent ,
    canActivate: [AdminAuthGuard]},
  { path: 'prod', component: TansikProdComponent ,
    canActivate: [AdminAuthGuard]},
  { path: 'events', component: TansikEventsComponent ,
    canActivate: [AdminAuthGuard]},
  { path: 'partenaires', component: PartenairesComponent ,
    canActivate: [AdminAuthGuard]},
  { path: 'ajout-partenaire', component: AjoutPartenaireComponent ,
    canActivate: [AdminAuthGuard]},
  { path: 'clients', component: ClientsComponent },
  {path: 'collab/:id',component: CollabDetailComponent},
  { path: 'upload-image-prestataire/:id', component: UploadImagePrestataireComponent ,
    canActivate: [AdminAuthGuard]},
  { path: 'modifiercomptes/:id', component: ModifierComptesComponent ,
    canActivate: [AdminAuthGuard]},
  // ✅ Route pour avis produit
  { path: 'gestion-avis/:id', component: GestionAvisComponent ,
    canActivate: [AdminAuthGuard]},
     { path: 'add-post', component: AddPostComponent ,
    canActivate: [AdminAuthGuard]},
{ path: 'posts/:id', component: PostDetailsComponent 
     },



  // ✅ Route pour avis événement
  { path: 'gestion-avis-event/:id', component: GestionAvisComponent ,
    canActivate: [AdminAuthGuard]},
    { path: 'rendez-vous', component: RendezVousComponent ,
      canActivate: [AdminAuthGuard]}
  ,    { path: 'command-events', component: CommandEventsComponent ,
    canActivate: [AdminAuthGuard]},
    { path: 'services', component: ServicesComponent ,
      canActivate: [AdminAuthGuard]},
      { path: 'newsletter', component: NewsletterComponent ,
        canActivate: [AdminAuthGuard]},
        { path: 'service/:id/media', component: AjouterMediaComponent ,
          canActivate: [AdminAuthGuard] }

        ,{ path: 'contact', component: ContactComponent ,
          canActivate: [AdminAuthGuard]} ,
        { path: 'collab', component: CollabComponent,canActivate: [AdminAuthGuard] },
  

  




  
  // 👇 Route pour charger PrestatairesModule en lazy loading

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }