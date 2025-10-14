import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { UserStorageService } from '../../services/storage/user-storage.service';

const BASIC_URL = "http://localhost:8081/";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  
  readonly BASE_URL = 'http://localhost:8081/api/admin';
  private BASIC_URL = 'http://localhost:8081/'; // Adjust to your backend URL
  constructor(private http: HttpClient) { }

  private createAuthorizationHeader(): HttpHeaders {
    return new HttpHeaders().set(
      'Authorization', 'Bearer ' + UserStorageService.getToken() // Espace ajouté après Bearer
    );
  }
  searchServices(params: any) {
    return this.http.get<any[]>('http://localhost:8081/api/admin/search', { params });
  }
  getAllCollabs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/collabs`, {
      headers: this.createAuthorizationHeader()
    });
  }
  // CATEGORY ENDPOINTS
  addCategory(categoryDto: any): Observable<any> {
    return this.http.post(BASIC_URL + 'api/admin/category', categoryDto, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getAllCategory(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/categories', {
      headers: this.createAuthorizationHeader(),
    });
  }

  // PRODUCT/SERVICE ENDPOINTS
// Ajouter un produit (prod ou events) avec FormData
addProduct(formData: FormData, endpoint: string): Observable<any> {
  return this.http.post(`${this.BASE_URL}/${endpoint}`, formData, {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${UserStorageService.getToken()}`
    }),
    reportProgress: true,
    observe: 'response'
  }).pipe(
    catchError(this.handleError)
  );
}
getFilteredServices(filterType: string, name?: string, date?: string, minPrice?: number, maxPrice?: number): Observable<any[]> {
  const params: any = { filterType };

  if (filterType === 'name') {
    params.name = name;
  } else if (filterType === 'date') {
    params.date = date;
  } else if (filterType === 'price') {
    params.minPrice = minPrice;
    params.maxPrice = maxPrice;
  }

  return this.http.get<any[]>(`${this.BASE_URL}/available`, { params });
}
private handleError(error: HttpErrorResponse) {
  let errorMessage = 'Une erreur inconnue est survenue';
  
  if (error.error instanceof ErrorEvent) {
    errorMessage = `Erreur client: ${error.error.message}`;
  } else if (error.status === 0) {
    errorMessage = 'Impossible de se connecter au serveur';
  } else {
    errorMessage = error.error?.message || error.message;
  }

  console.error('Erreur API:', error);
  return throwError(() => new Error(errorMessage));
}

// ... other service methods


updateProduct(serviceId: number, serviceDto: FormData, afficherDans: string): Observable<any> {
  const endpoint = afficherDans === 'prod' 
    ? `${this.BASIC_URL}api/admin/service/prod/${serviceId}`
    : `${this.BASIC_URL}api/admin/service/events/${serviceId}`;
  
  return this.http.put(endpoint, serviceDto, {
    headers: this.createAuthorizationHeader()
  });
}

  getAllProducts(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/services', { // Changé de 'products' à 'services'
      headers: this.createAuthorizationHeader(),
    });
  }

// In AdminService - already correct
getServiceById(serviceId: number): Observable<any> {
  return this.http.get(`${this.BASIC_URL}api/admin/service/${serviceId}`, {
    headers: this.createAuthorizationHeader()
  });
}
getAllProductByName(name: any): Observable<any> {
  return this.http.get(`${BASIC_URL}api/admin/search/${name}`, {
    headers: this.createAuthorizationHeader(),
  }).pipe(
    tap(data => console.log('Réponse de l\'API:', data)), // Ajoutez ceci pour déboguer
    catchError(error => {
      console.error('Erreur lors de la recherche de produits', error);
      return of([]); // Retourne un tableau vide en cas d'erreur
    })
  );
}
  deleteProduct(serviceId: any): Observable<any> {
    return this.http.delete(`${BASIC_URL}api/admin/delete/service/${serviceId}`, {
      headers: this.createAuthorizationHeader(),
      responseType: 'text' // ✅ pour que Angular accepte un body string
    });
  }
  updateStatus(serviceId: number, status: string): Observable<any> {
    return this.http.put(
      `${BASIC_URL}api/admin/update/service/status/${serviceId}?status=${status}`,
      {},
      {
        headers: this.createAuthorizationHeader(),
        responseType: 'text'
      }
    );
  }


  updateCoponStatus(coponId: number, status: string): Observable<any> {
    return this.http.put(
      `${BASIC_URL}api/admin/copon/update/status/${coponId}?status=${status}`,
      {},
      {
        headers: this.createAuthorizationHeader(),
        responseType: 'text'
      }
    );
  }
  getAllProductByFilters(title: string, minPrice: number, maxPrice: number, startDate: Date, endDate: Date): Observable<any[]> {
    const params = {
      title,
      minPrice,
      maxPrice,
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null
    };
    return this.http.get<any[]>('http://localhost:8081/api/services', { params });
  }
  // searchServices(filters: any): Observable<any[]> {
  //   const params = new HttpParams({ fromObject: filters });
  //   return this.http.get<any[]>('http://localhost:8081/api/services/search', { params });
  // }
  
  // ORDER ENDPOINTS
  getPlacedOrders(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/placedOrders', {
      headers: this.createAuthorizationHeader(),
    });
  }

  changeOrderStatus(reservationId: number, status: string): Observable<any> {
    return this.http.put(`${BASIC_URL}api/admin/reservation/${reservationId}/${status}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  deleteOrder(reservationId: number): Observable<any> {
    return this.http.delete(`${BASIC_URL}api/admin/delete-reservation/${reservationId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getAnalytics(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/reservation/analytics', {
      headers: this.createAuthorizationHeader(),
    });
  }

  // COUPON ENDPOINTS
  getCopon(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/copon/copons', {
      headers: this.createAuthorizationHeader(),
    });
  }

  // addCopon(copontDto: any): Observable<any> {
  //   return this.http.post(BASIC_URL + 'api/admin/copon', copontDto, {
  //     headers: this.createAuthorizationHeader(),
  //   });
  // }

  deleteCopon(coponId: number): Observable<any> {
    return this.http.delete(`${BASIC_URL}api/admin/copon/delete-copon/${coponId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }
  updateCopon(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${BASIC_URL}api/admin/copon/update-copon/${id}`, formData);
  }
  
  getServicesByAffichage(type: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8081/api/admin/services/affichage/${type}`);
  }
  // Récupérer toutes les réservations (admin)
getAllReservations(): Observable<any[]> {
  return this.http.get<any[]>(`${BASIC_URL}api/reservation-events/all`);
}

// Changer le statut d'une réservation
// AdminService
changeReservationEventStatus(reservationId: number, status: string): Observable<any> {
  return this.http.put(`http://localhost:8081/api/reservation-events/status/${reservationId}?status=${status}`, null, {
    headers: this.createAuthorizationHeader()
  });
}

// CommandEventsComponent


searchReservationsByUserName(name: string) {
  return this.http.get<any[]>(`http://localhost:8081/api/admin/reservations/search?name=${name}`);
}
searchReservationsProdByUserName(name: string) {
  return this.http.get<any[]>(`http://localhost:8081/api/admin/orders/search?name=${name}`);
}
deleteReviewById(reviewId: number): Observable<any> {
  return this.http.delete(`http://localhost:8081/api/admin/supprime/${reviewId}`, {
    headers: this.createAuthorizationHeader(),
    responseType: 'text'
  });
}

getServicesByPrestataireId(prestataireId: number): Observable<any> {  
  return this.http.get<any[]>
  (`http://localhost:8081/api/admin/services/prestataire/${prestataireId}`, {
  });
}

updateAvailability(prestataireId: number, dates: String[]): Observable<{ message: string }> {
  return this.http.post<{ message: string }>(`http://localhost:8081/api/admin/update-availability/${prestataireId}`, dates, {
    headers: { 'Content-Type': 'application/json' }  });
}
 
updateAvailabilityText(prestataireId: number, dates: string[]): Observable<string> {
  return this.http.post(`http://localhost:8081/api/admin/update-availability/${prestataireId}`, dates, {
    headers: { 'Content-Type': 'application/json' },
    responseType: 'text'
  });
}

addPack(data: any) {
  return this.http.post(`${BASIC_URL}api/admin/pack`, data, {
    headers: this.createAuthorizationHeader()
  });
}

getAllCategories() {
  return this.http.get<any[]>(`${BASIC_URL}api/admin/categories`);
}

getServicesByCategory(categoryId: number) {
  return this.http.get<any[]>(`${BASIC_URL}api/admin/category/${categoryId}`, {
    headers: this.createAuthorizationHeader()
  });
}
addCopon(coponFormData: FormData): Observable<any> {
  return this.http.post(`${this.BASE_URL}/copon`, coponFormData, {
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + UserStorageService.getToken()
    })
    // Ne pas ajouter Content-Type ici
  });
}
  getAllRendezVous(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/rendezvous/all', {
      headers: this.createAuthorizationHeader(),
    });
  }

  updateRendezVousStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.BASIC_URL}api/rendezvous/${id}/status?status=${status}`, {}, {
      headers: this.createAuthorizationHeader()
    });
  }
  annulerRendezVousByAdmin(rdvId: number) {
    return this.http.put(`http://localhost:8081/api/rendezvous/${rdvId}/status?status=ANNULLEE`, {}, {
      responseType: 'text' as 'json'
    });
  }
  
  updateHeureRendezVousByAdmin(rdvId: number, nouvelleHeure: string) {
    return this.http.put(`http://localhost:8081/api/rendezvous/rendezvous/${rdvId}/update-heure/0`, nouvelleHeure, {
      responseType: 'text' as 'json'
    });
  }
  confirmerRendezVousByAdmin(rdvId: number) {
    return this.http.put(`http://localhost:8081/api/rendezvous/${rdvId}/status?status=ACCEPTER`, {}, {
      responseType: 'text' as 'json'
    });
  }
  getAnalyticsEvents(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/reservation-events/analytics', {
      headers: this.createAuthorizationHeader(),
    });
  }
  bloquerUser(userId: number): Observable<any> {
    return this.http.put(`${BASIC_URL}bloquer/${userId}`, {}, {
      headers: this.createAuthorizationHeader(),
      responseType: 'text'
    });
  }
  getAllContacts(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/contact/ContactList');
  }
  
  debloquerUser(userId: number): Observable<any> {
    return this.http.put(`${BASIC_URL}debloquer/${userId}`, {}, {
      headers: this.createAuthorizationHeader(),
      responseType: 'text'
    });
  }
  
  deleteMediaById(mediaId: number) {
    return this.http.delete(`http://localhost:8081/api/admin/service-media/${mediaId}`);
  }
  
  updateMediaStatus(mediaId: number, status: string) {
    return this.http.put<{ message: string }>(
      `http://localhost:8081/api/admin/service-media/${mediaId}/status?status=${status}`, 
      {}
    );
  }
 deleteCategory(id: number) {
  return this.http.delete(`${this.BASE_URL}/categories/${id}`, {
    headers: this.createAuthorizationHeader(),
    responseType: 'text' as const  // ✅ tell Angular to expect plain text
  });
  }
 deleteService(id: number): Observable<any> {
  return this.http.delete(`${this.BASE_URL}/delete/service/${id}`, {
    headers: this.createAuthorizationHeader(),
    responseType: 'text' // if your backend returns plain text
  });
}



  
  
  


}