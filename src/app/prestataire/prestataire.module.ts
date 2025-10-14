import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrestataireRoutingModule } from './prestataire-routing.module';
import { PrestataireComponent } from './prestataire.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DisposComponent } from './dispos/dispos.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ProfileComponent } from './profile/profile.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSpinner } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CustomerRoutingModule } from '../customer/customer-routing.module';


@NgModule({
  declarations: [
    PrestataireComponent,
    DashboardComponent,
    DisposComponent,
    ReservationsComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    PrestataireRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatIconModule
    ,    CommonModule,
        CustomerRoutingModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDividerModule,
        MatSelectModule,
        MatOptionModule , 
        FormsModule, // <-- Ajoutez ceci
        ReactiveFormsModule, // <-- Optionnel mais recommandé
        MatSnackBarModule,
        // MatDatepicker,
        // MatDatepickerInput,
        MatDatepickerModule,
        MatDialogModule,
      MatSpinner// ✅ ICI,,
    
  ]
})
export class PrestataireModule { }
