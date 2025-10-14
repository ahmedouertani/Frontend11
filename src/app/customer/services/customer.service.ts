import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { UserStorageService } from '../../services/storage/user-storage.service';

const BASIC_URL = "http://localhost:8081/";
  
@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = '/api/reservation-events';

  private apiUrl2 = 'http://localhost:8081/api/customer/addition'; // Assurez-vous que l'URL correspond à votre backend
  private apiUrl3 = 'http://localhost:8081/api/customer/soustraction'; // Assurez-vous que l'URL correspond à votre backend
  private BASIC_URL1 = 'http://localhost:8081/api/profile';

  constructor(
    private http: HttpClient
  ) { }
  private demandeCountSubject = new BehaviorSubject<number>(0);
  demandeCount$ = this.demandeCountSubject.asObservable();
  
  updateDemandeCount(): void {
    this.getDemandeCountByUserId().subscribe({
      next: count => this.demandeCountSubject.next(count),
      error: () => this.demandeCountSubject.next(0)
    });
  }

  // Récupérer tous les produits
  getAllProducts(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/customer/services', {
      headers: this.createAuthorizationHeader(),
    });
  }

  // Récupérer un produit par son nom
  getAllProductByName(name: any): Observable<any> {
    return this.http.get(`${BASIC_URL}api/customer/search/${name}`, {
      headers: this.createAuthorizationHeader(),
    });
  }
  getMediaByServiceId(serviceId: number) {
    return this.http.get<any[]>(`http://localhost:8081/api/admin/service-media/${serviceId}`);
  }
  
  getActiveMediaByServiceId(serviceId: number) {
    return this.http.get<any[]>(`http://localhost:8081/api/customer/service/${serviceId}/medias`);
  }
  

  // Ajouter un produit au panier
  // addToCart(productId: any): Observable<any> {
  //   const cartDto = {
  //     productId: productId,
  //     userId: UserStorageService.getUserId(), // Utilise la méthode qui récupère l'ID utilisateur
  //   };

  //   return this.http.post<any>(this.apiUrl, cartDto, {
  //     headers: new HttpHeaders({
  //       'Authorization': 'Bearer ' + localStorage.getItem('token'), // Si vous avez un token JWT
  //     }),
  //   }).pipe(
  //     tap((res) => {
  //       console.log("Produit ajouté au panier", res);  // Vérification du résultat de l'ajout
  //     }),
  //     catchError((error) => {
  //       console.error("Erreur d'ajout au panier", error);  // Gestion des erreurs
  //       throw error;
  //     })
  //   );
  // }


  addToCart(demande: { serviceId: number, userId: number }): Observable<any> {
    return this.http.post('http://localhost:8081/api/customer/demande', demande, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + UserStorageService.getToken()
      }),
      responseType: 'json'
    });
  }
  

  // Créer l'en-tête d'autorisation avec le token JWT
  private createAuthorizationHeader(): HttpHeaders {
    return new HttpHeaders().set(
      'Authorization', 'Bearer ' + UserStorageService.getToken()  // Ajout de l'espace entre Bearer et le token
    );
  }

  // Récupérer les éléments du panier pour un utilisateur donné
  getCartByUserId(): Observable<any> {
    const userId = UserStorageService.getUserId();
    return this.http.get(BASIC_URL + `api/customer/demande/${userId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }
  

  applyCopon(code:any): Observable<any> {
    const userId = UserStorageService.getUserId();
    return this.http.get(BASIC_URL + `api/customer/copon/${userId}/${code}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  
  placeOrder(orderDto: any): Observable<any> {
    orderDto.userId = UserStorageService.getUserId();
    return this.http.post(`${BASIC_URL}api/customer/placeOrder`, orderDto, {
      headers: this.createAuthorizationHeader(),
    });
}

getOrdersByUserId(): Observable<any> {
  const userId = UserStorageService.getUserId();
  return this.http.get(BASIC_URL +`api/customer/myOrders/${userId}`, {
    headers: this.createAuthorizationHeader(),
  });
}

getOrderedProducts(orderId:number): Observable<any> {
  return this.http.get(BASIC_URL +`api/customer/ordered-products/${orderId}`, {
    headers: this.createAuthorizationHeader(),
  });
}

giveReview(reviewDto: FormData): Observable<any> {
  return this.http.post(BASIC_URL + `api/customer/review`, reviewDto, {
    headers: this.createAuthorizationHeaderWithoutContentType() // on enlève Content-Type ici
  });
}
createAuthorizationHeaderWithoutContentType(): HttpHeaders {
  const token = localStorage.getItem('accessToken'); // ou getToken() si tu l’as
  return new HttpHeaders({
    Authorization: `Bearer ${token}`
    // NE PAS mettre 'Content-Type': 'multipart/form-data'
  });
}


increaseProductQuantity(productId: any): Observable<any> {
  const cartDto = {
    productId: productId,
    userId: UserStorageService.getUserId()
  };

  return this.http.post<any>(this.apiUrl2, cartDto, {
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
    }),
  }).pipe(
    tap(res => {
      console.log("Quantité augmentée", res);
    }),
    catchError(error => {
      console.error("Erreur lors de l'ajout de quantité", error);
      throw error;
    })
  );
}

decreaseProductQuantity(productId: any): Observable<any> {
  const cartDto = {
    productId: productId,
    userId: UserStorageService.getUserId()
  };

  return this.http.post<any>(this.apiUrl3, cartDto, {
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
    }),
  }).pipe(
    tap(res => {
      console.log("Quantité diminuée", res);
    }),
    catchError(error => {
      console.error("Erreur lors de suppression de quantité", error);
      throw error;
    })
  );
}

getProductDetailById(serviceId: number): Observable<any> {
  return this.http.get(BASIC_URL+`api/customer/services/${serviceId}`);
}

addProductToWishlist(wishlistDto:any): Observable<any> {
  return this.http.post(BASIC_URL +`api/customer/wishlist`, wishlistDto,{
    headers: this.createAuthorizationHeader(),
  });
}

getWishListByUserId(): Observable<any> {
  const userId = UserStorageService.getUserId();

  return this.http.get(BASIC_URL +`api/customer/wishlist/${userId}`, {
    headers: this.createAuthorizationHeader(),
  });
}

removeDemandeById(demandeId: number): Observable<any> {
  return this.http.delete(BASIC_URL+`api/customer/demande/delete/${demandeId}`, {
    headers: this.createAuthorizationHeader()
  }).pipe(
    tap(() => this.updateDemandeCount()) // 👈 ici
  );
}


clearCart(userId: number): Observable<any> {
  return this.http.delete(`${BASIC_URL}api/customer/demande/clear/${userId}`, {
    headers: this.createAuthorizationHeader()
  }).pipe(
    tap(() => this.updateDemandeCount()) // 👈 ici
  );
}



getProfile(userId: number): Observable<any> {
  return this.http.get(`${this.BASIC_URL1}/${userId}`);
}

updateProfileWithImage(userId: number, formData: FormData): Observable<any> {
  return this.http.put(`${this.BASIC_URL1}/update/${userId}`, formData);
}


deleteOrder(reservationId: number, userId: number): Observable<any> {
  const url = `http://localhost:8081/api/customer/reservation/${reservationId}/${userId}`;
  return this.http.delete(url, {
    headers: this.createAuthorizationHeader(), // Important si tu utilises JWT
    observe: 'response',
  }).pipe(
    catchError(error => {
      if (error.status === 404) {
        throw { businessError: 'ORDER_NOT_FOUND_OR_NOT_OWNED' };
      } else if (error.status === 400) {
        throw { businessError: 'DELIVERED_ORDER_CANT_BE_DELETED' };
      }
      throw error;
    })
  );
}
deleteWishlist(wishlistId: number,userId:number): Observable<string> {
  return this.http.delete(`${BASIC_URL}api/customer/delete/${wishlistId}/${userId}`, {
    responseType: 'text' // ⚠️ très important !
  });
}
getServicesByDate(date: Date): Observable<any[]> {
  const formattedDate = new Date(date).toISOString().split('T')[0];
  return this.http.get<any[]>(`http://localhost:8081/api/customer/services/available?date=${formattedDate}`);
}
searchEventsByKeywordOrDate(keyword: string): Observable<any[]> {
  return this.http.get<any[]>(`http://localhost:8081/api/customer/service/events/search?keyword=${keyword}`);
}
addToDemande(userId: number, serviceId: number): Observable<any> {
  return this.http.post(BASIC_URL+`${this.apiUrl}/add-to-demande`, { userId, serviceId });
}

validateReservation(userId: number, address: string, description: string, date: Date): Observable<any> {
  return this.http.post(BASIC_URL+`${this.apiUrl}/valider`, null, {
    params: {
      userId: userId.toString(),
      adresse: address,
      description,
      date: date.toISOString()
    }
  });
}
getDemandesByUser(userId: number): Observable<any> {
  return this.http.get(BASIC_URL+`${this.apiUrl}/by-user/${userId}`);
}


deleteDemande(serviceId: number, userId: number): Observable<any> {
  return this.http.delete(BASIC_URL+`${this.apiUrl}/delete`, {
    params: {
      serviceId: serviceId.toString(),
      userId: userId.toString()
    }
  });
}

getDemandeCountByUserId(): Observable<number> {
  const userId = +UserStorageService.getUserId();
  return this.http.get<number>(`http://localhost:8081/api/customer/demande/count/${userId}`);
}
getAvailableServices(categoryId: number, date: Date): Observable<any> {
  return this.http.get(BASIC_URL+`${this.apiUrl}/available-services`, {
    params: {
      categoryId: categoryId.toString(),
      date: date.toISOString()
    }
  });
}
getEventDetailById(eventId: number): Observable<any> {
  return this.http.get<any>(BASIC_URL+`api/customer/events/${eventId}`);
}
getProdDetailById(prodId: number): Observable<any> {
  return this.http.get<any>(BASIC_URL+`api/customer/prod/${prodId}`);
}
getReviewsByEventId(eventId: number): Observable<any[]> {
  return this.http.get<any[]>(BASIC_URL + `api/customer/reviews/events/${eventId}`);
}
getReviewsByProdId(prodId: number): Observable<any[]> {
  return this.http.get<any[]>(BASIC_URL + `api/customer/reviews/prod/${prodId}`);
}
getEventReservationsByUser(): Observable<any[]> {
  const userId = +UserStorageService.getUserId();
  return this.http.get<any[]>(`http://localhost:8081/api/reservation-events/user/${userId}`, {
    headers: this.createAuthorizationHeader()
  });
}

deleteReservationEvent(reservationId: number, userId: number): Observable<any> {
  return this.http.delete(`http://localhost:8081/api/reservation-events/${reservationId}/${userId}`, {
    headers: this.createAuthorizationHeader()
  });
}
prendreRendezVousPublic(dto: any): Observable<any> {
  return this.http.post(`http://localhost:8081/api/rendezvous/public`, dto);
}
updateHeureRendezVous(rendezVousId: number, userId: number, nouvelleHeure: string) {
  return this.http.put( `http://localhost:8081/api/rendezvous/${rendezVousId}/update-heure/${userId}`, nouvelleHeure, {
    headers: this.createAuthorizationHeader(),
    responseType: 'text' as 'json'
  });
}


getMesRendezVous(userId: number): Observable<any> {
  // Vérifiez que l'URL correspond à votre endpoint backend
  return this.http.get(`http://localhost:8081/api/rendezvous/user/${userId}`, {
    headers: this.createAuthorizationHeader()
  });
}


// ✅ Annuler un de mes rendez-vous
// ✅ Service pour annuler le rendez-vous
annulerRendezVous(rendezVousId: number, userId: number): Observable<any> {
  return this.http.put(
    `http://localhost:8081/api/rendezvous/${rendezVousId}/cancel/${userId}`,
    null,
    {
      headers: this.createAuthorizationHeader(),
      responseType: 'text' as 'json'
    }
  );
}


}

