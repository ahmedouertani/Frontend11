import { Component, OnInit } from '@angular/core';
import { UserStorageService } from '../../services/storage/user-storage.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-reservations',
  standalone: false,
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {

  reservations: any[] = [];
  displayedColumns: string[] = [  'userName', 'adresse', 'reservationDescription','date', 'status'];
  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const prestataireId = +UserStorageService.getUserId();
    this.authService.getReservationsByPrestataire(prestataireId).subscribe(res => {
      this.reservations = res;
    });
  }
}
