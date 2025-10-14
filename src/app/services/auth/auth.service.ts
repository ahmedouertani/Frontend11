import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { UserStorageService } from '../storage/user-storage.service';
//import { UserStorageService } from '../storage/auth.service';


const BASIC_URL = "http://localhost:8081/";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private BASE_URL = 'http://localhost:8081/api/newsletter';

  constructor(private http: HttpClient,
    private userStorageService: UserStorageService

  ) { }
  register(singupRequest: any): Observable<any> {
    return this.http.post(BASIC_URL + "sign-up", singupRequest)
  }
login(username: string, motdepasse: string): Observable<boolean> {
  const headers = new HttpHeaders().set('Content-Type', 'application/json');
  const body = { username, motdepasse };

  return this.http.post<any>(`${BASIC_URL}authentificate`, body, { headers, observe: 'response' }).pipe(
    map((res) => {
      console.log('=== DEBUG AFTER BACKEND FIX ===');
      console.log('Authorization header:', res.headers.get('Authorization'));
      console.log('Response body:', res.body);

      if (res.body && res.body.userId && res.body.role) {
        const authHeader = res.headers.get('Authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          console.error('Invalid Authorization header format');
          return false;
        }
        
        // Simple extraction now that backend is fixed
        const token = authHeader.substring(7);
        console.log('Clean token:', token);
        
        this.userStorageService.saveToken(token);
        
        const userWithoutToken = {
          userId: res.body.userId,
          role: res.body.role
        };
        
        this.userStorageService.saveUser(userWithoutToken);
        return true;
      }
      return false;
    }),
    catchError((error) => {
      console.error('Erreur lors de la connexion', error);
      return of(false);
    })
  );
}
  
  getOrderByTrackingId(trackingId: number):Observable<any>{
    return this.http.get(BASIC_URL+`reservation/${trackingId}` )
  }

  registerPrestataire(data: any) {
    return this.http.post(BASIC_URL+`sign-up/prestataire`, data);
  }
  
  
  // Add to your existing AuthService
getAllPrestataires(): Observable<any> {
  return this.http.get(BASIC_URL + 'prestataires');
}


getAllClients(): Observable<any> {
  return this.http.get(BASIC_URL + 'clients');
}

// Dans votre AuthService
deletePrestataireById(id: number): Observable<any> {
  return this.http.delete(`${BASIC_URL}prestataire/${id}`, { responseType: 'text' }).pipe(
    catchError(error => {
      if (error.status === 404) {
        return of(false);
      }
      return throwError(() => error);
    })
  );
}

// deleteOrdersByUserId(userId: number): Observable<any> {
//   return this.http.delete(BASIC_URL+`orders/user/${userId}`);
// }

// deleteClient(id: number): Observable<any> {
//   return this.http.delete(BASIC_URL+`client/${id}`);
// }

deleteCustomerAndOrders(userId: number): Observable<{success: boolean, message?: string}> {
  return this.http.delete(`${BASIC_URL}clients/${userId}`, { 
    observe: 'response',
    responseType: 'text' // Important pour les réponses texte
  }).pipe(
    map(response => {
      return {
        success: response.status === 200,
        message: response.body
      };
    }),
    catchError(error => {
      if (error.status === 404) {
        return of({success: false, message: 'Client introuvable'});
      }
      return throwError(() => error);
    })
  );
}


uploadImage(url: string, prestataireId: number): Observable<any> {
  return this.http.post(BASIC_URL+`upload?url=${url}&prestataireId=${prestataireId}`, {});
}

getImagesByPrestataire(id: number): Observable<any[]> {
  return this.http.get<any[]>(BASIC_URL+`/prestataire/${id}`);
}

getUserId(): number {
  const user = UserStorageService.getUser();
  if (!user || !user.userId) {
    throw new Error("Utilisateur non connecté");
  }
  return user.userId;
}

updateUserByAdmin(userId: number, formData: FormData): Observable<any> {
  const token = UserStorageService.getToken();
  const headers = new HttpHeaders().set(
    'Authorization',
    'Bearer ' + token
  );

  // ✅ CHANGEMENT ICI : utilise le bon endpoint
  return this.http.put(`${BASIC_URL}api/profile/update/${userId}`, formData, { headers });
}

// ✅ Récupérer un utilisateur par ID (admin)
getUserById(userId: number): Observable<any> {
  const token = UserStorageService.getToken();
  const headers = new HttpHeaders().set(
    'Authorization',
    'Bearer ' + token
  );

  // ✅ CHANGEMENT ICI : utilise le bon endpoint
  return this.http.get(`${BASIC_URL}api/profile/${userId}`, { headers });
}

getReservationsByPrestataire(prestataireId: number): Observable<any[]> {
  return this.http.get<any[]>(`${BASIC_URL}api/reservation-events/prestataire/${prestataireId}`);
}
getAllEmails(): Observable<any[]> {
  return this.http.get<any[]>(`${this.BASE_URL}/all`);
}

createAuthorizationHeader() {
  const token = localStorage.getItem('token');
  if (token) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  } else {
    return {
      'Content-Type': 'application/json'
    };
  }
}

sendNewsletter(payload: any): Observable<any> {
  return this.http.post(BASIC_URL + `api/newsletter/send`, payload, {
    headers: this.createAuthorizationHeader(),
    responseType: 'text' as 'json'
  });
}


  }



