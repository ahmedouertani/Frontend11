import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserStorageService } from './storage/user-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationEventService {
  private baseUrl = 'http://localhost:8081/api/reservation-events';

  constructor(private http: HttpClient) {}

  // Ajouter un service à la demande
  ajouterDemande(userId: number, serviceId: number): Observable<string> {
    return this.http.post(`${this.baseUrl}/add-to-demande/${userId}/${serviceId}`, {}, { responseType: 'text' });
  }

  // Valider la réservation
  validerReservation(formData: FormData): Observable<string> {
    return this.http.post(`${this.baseUrl}/valider`, formData, { responseType: 'text' });
  }

  // Récupérer les demandes de l'utilisateur
  getDemandesByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/by-user/${userId}`);
  }

  // Supprimer une demande
  supprimerDemande(serviceId: number, userId: number): Observable<any> {
    return this.http.delete(`http://localhost:8081/api/reservation-events/delete?serviceId=${serviceId}&userId=${userId}`, {
      responseType: 'text' // très important si le backend ne retourne rien ou une chaîne simple
    });
  }
  

  // Récupérer les services alternatifs
  getAlternatives(serviceId: number, date: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/alternatives`, {
      params: new HttpParams()
        .set('serviceId', serviceId)
        .set('date', date)
    });
  }
  
  // Récupérer les dates indisponibles pour un service
  getUnavailableDates(serviceId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/unavailable-dates/${serviceId}`);
  }

  // Remplacer un service dans la demande
  remplacerDemande(userId: number, oldServiceId: number, newServiceId: number): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/remplacer`,
      null,
      {
        params: new HttpParams()
          .set('userId', userId)
          .set('oldServiceId', oldServiceId)
          .set('newServiceId', newServiceId),
        responseType: 'text'
      }
    );
  }
  getUnavailableHours(date: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/unavailable-hours`, {
      params: new HttpParams().set('date', date)
    });
  }
  
}