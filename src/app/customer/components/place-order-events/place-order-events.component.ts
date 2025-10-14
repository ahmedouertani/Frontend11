import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReservationEventService } from '../../../services/reservation-event.service';
import { UserStorageService } from '../../../services/storage/user-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-place-order-events',
  standalone: false,
  templateUrl: './place-order-events.component.html',
  styleUrls: ['./place-order-events.component.css']
})
export class PlaceOrderEventsComponent implements OnInit {
  form!: FormGroup;
  services: any[] = [];
  availableReplacements: { [key: number]: any[] } = {};
  userId!: number;

  showFinalizeButton: boolean = false;
  allHours: string[] = [
    '07:00','08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00','15:00', '16:00', '17:00', '18:00',
    '19:00', '20:00', '21:00','22:00', '23:00', '00:00', '01:00',
    '02:00', '03:00', '04:00','05:00', '06:00'
  ];
  availableHours: string[] = [];
  
  minDate: Date = new Date(); // هنا
  joursFeries: string[] = ['2025-01-01','2025-03-20','2025-07-25']; // أيام فريه إذا تحب
  dateFilter = (d: Date | null): boolean => { // هنا
    if (!d) return false;
    const day = d.getDay();
    const dateStr = this.formatDateOnly(d);
    return day !== 0 && !this.joursFeries.includes(dateStr) && d >= this.minDate;
  };

  constructor(
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private reservationService: ReservationEventService,
    private router :Router
  ) {}

  ngOnInit(): void {
    const user = UserStorageService.getUser();
    if (user && user.userId) {
      this.userId = +user.userId;
    }

    this.form = this.fb.group({
      date: [null, Validators.required],
      heure: [null, Validators.required],
      adresse: [null, Validators.required],
      description: [null, Validators.required],
      codePromo: ['']
    });

    this.loadDemandes();
  }

  goToPlaceOrder() {
    this.router.navigate(['customer/tansikevents']);
  }

  loadAvailableHours(date: Date): void {
    const formattedDate = this.formatDateOnly(date);
    this.reservationService.getUnavailableHours(formattedDate).subscribe({
      next: (unavailableHours) => {
        // Si aucune heure n'est indisponible, on affiche toutes les heures
        this.availableHours = unavailableHours.length === 0
        ? [...this.allHours]
        : this.allHours.filter(hour => !unavailableHours.includes(hour));
      
        
        // Réinitialiser et activer le champ 'heure' après le chargement
        this.form.get('heure')?.reset();
        this.form.get('heure')?.enable();
        console.log('Heures indisponibles:', unavailableHours);
console.log('Heures disponibles après filtrage:', this.availableHours);

      },
      error: () => {
        this.snackbar.open('Erreur lors du chargement des heures', 'Fermer', { duration: 3000 });
      }
    });
    
  }

  loadDemandes() {
    this.reservationService.getDemandesByUser(this.userId).subscribe(data => {
      this.services = data;
    });
  }

  onDateSelected(event: any): void {
    const date = event.value;
    if (date) {
      this.loadAvailableHours(date);
    }
  }

  finaliserReservation() {
    if (this.form.invalid) {
      this.snackbar.open('❌ Remplissez tous les champs correctement', 'Fermer', { duration: 3000 });
      return;
    }

    const formattedDateTime = this.formatDateTime(this.form.value.date, this.form.value.heure);

    const formData = new FormData();
    formData.append('userId', this.userId.toString());
    formData.append('adresse', this.form.value.adresse);
    formData.append('description', this.form.value.description);
    formData.append('date', formattedDateTime);
    formData.append('codePromo', this.form.value.codePromo || '');

    this.reservationService.validerReservation(formData).subscribe({
      next: () => {
        this.snackbar.open('✅ Réservation validée', 'Fermer', { duration: 3000 });
        this.form.reset();
        this.availableHours = [];
        this.loadDemandes();
      },
      error: (err) => {
        const message = err.error;
        if (message.includes('expiré')) {
          this.snackbar.open('❌ Code promo expiré avant cette date', 'Fermer', { duration: 4000 });
        } else if (message.includes('le total est')) {
          this.snackbar.open('❌ Montant insuffisant pour ce code promo', 'Fermer', { duration: 4000 });
        } else if (message.includes('introuvable')) {
          this.snackbar.open('❌ Code promo introuvable', 'Fermer', { duration: 4000 });
        } else {
          this.snackbar.open('❌ Erreur lors de la validation', 'Fermer', { duration: 3000 });
        }
      }
    });
  }

  supprimer(serviceId: number) {
    this.reservationService.supprimerDemande(serviceId, this.userId).subscribe({
      next: () => {
        this.snackbar.open('Service supprimé', 'Fermer', { duration: 3000 });
        this.loadDemandes();
      },
      error: () => {
        this.snackbar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
      }
    });
  }

  formatDateTime(date: Date, time: string): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${time}:00`;
  }

  formatDateOnly(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
}
