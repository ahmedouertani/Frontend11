import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Collab {
  id?: number;   // auto-increment ID
  nom: string;
  logo: string;
  description?: string;
  gallery?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CollabService {
  private apiUrl = 'http://localhost:8081/api/collabs'; // backend Spring Boot

  constructor(private http: HttpClient) {}

  getAll(): Observable<Collab[]> {
    return this.http.get<Collab[]>(this.apiUrl);
  }

  addCollab(collab: Collab): Observable<Collab> {
    return this.http.post<Collab>(this.apiUrl, collab);
  }

  deleteCollab(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getById(id: number): Observable<Collab> {
  return this.http.get<Collab>(`${this.apiUrl}/${id}`);
  }
  updateCollab(id: number, collab: Collab): Observable<Collab> {
    return this.http.put<Collab>(`${this.apiUrl}/${id}`, collab);
  }

}
