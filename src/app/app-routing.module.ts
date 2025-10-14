import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

import { EventscontactComponent } from './eventscontact/eventscontact.component';
import { ProdcontactComponent } from './prodcontact/prodcontact.component';
import { LoginsComponent } from './logins/logins.component';

const routes: Routes = [
  { path: '', component:HomeComponent }, // Doit être en premier
  { path: 'logins', component: LoginsComponent },
  { path: 'home', component:HomeComponent }, // Doit être en premier

  { path: 'prodcontact', component: ProdcontactComponent },
  { path: 'eventscontact', component: EventscontactComponent },


  { path: 'customer', loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule) },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: 'prestataire', loadChildren: () => import('./prestataire/prestataire.module').then(m => m.PrestataireModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}