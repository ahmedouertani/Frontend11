import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DemoAngularMaterialModule } from './demo-angular-material/demo-angular-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MyOrdersComponent } from './customer/components/dashboard/my-orders/my-orders.component';
import { TrackOrderComponent } from './track-order/track-order.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { LoginsComponent } from './logins/logins.component';
import { HomeComponent } from './home/home.component';
import { ProdcontactComponent } from './prodcontact/prodcontact.component';
import { AccComponent } from './acc/acc.component';
import { AuthInterceptor } from '../interceptor/auth.interceptor';
import { Title, Meta } from '@angular/platform-browser';



@NgModule({
  declarations: [
    AppComponent,HomeComponent,    LoginsComponent,

    TrackOrderComponent,
    ProdcontactComponent,
    AccComponent,
    

 ],
  imports: [
    CommonModule,

    BrowserModule,
    AppRoutingModule,
    DemoAngularMaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule ,
    HttpClientModule,
    MatCardModule,
    MatDividerModule,MatChipsModule,MatDividerModule,    MatBadgeModule // 👈 ajoute ici

  ],
  providers: [
      {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
