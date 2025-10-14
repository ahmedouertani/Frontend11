import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrestataireComponent } from './prestataire.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DisposComponent } from './dispos/dispos.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { PrestataireAuthGuard } from '../guards/prestataire-auth.guard';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: '', component: PrestataireComponent,
    canActivate: [PrestataireAuthGuard], children: [
    { path: 'dashboard', component: DashboardComponent ,
      canActivate: [PrestataireAuthGuard]},
    { path: 'dispos', component: DisposComponent ,
      canActivate: [PrestataireAuthGuard]},
    { path: 'reservations', component: ReservationsComponent,
      canActivate: [PrestataireAuthGuard] },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'profile', component: ProfileComponent,
      canActivate: [PrestataireAuthGuard] },
  ]},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrestataireRoutingModule { }
