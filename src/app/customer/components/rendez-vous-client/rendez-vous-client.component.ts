import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserStorageService } from '../../../services/storage/user-storage.service';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-rendez-vous-client',
  standalone: false,
  templateUrl: './rendez-vous-client.component.html',
  styleUrls: ['./rendez-vous-client.component.css']
})
export class RendezVousClientComponent implements OnInit {

  userId: number = 0;
  form!: FormGroup;
  reservedSlots: { date: string; heure: string }[] = [];
  availableHours: string[] = [];
  isSlotTaken = false;
  rendezvousList: any[] = [];
  selectedRendezVous: any = null;

  allHours: string[] = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackbar: MatSnackBar,
    private customerService: CustomerService
  ) {}

  ngOnInit() {
    const id = UserStorageService.getUserId();
    this.userId = id ? Number(id) : 0;
    if (this.userId > 0) this.loadMesRendezVous();

    this.form = this.fb.group({
      date: ['', Validators.required],
      heure: ['', Validators.required]
    });

    this.loadReservedSlots();
  }

  loadReservedSlots() {
    this.http.get<any[]>('http://localhost:8081/api/rendezvous/all').subscribe({
      next: (data) => {
        this.reservedSlots = data
          .filter(rdv => {
            const date = rdv.date?.slice(0, 10);
            const heure = rdv.heure?.slice(0, 5);

            const isEditing = this.selectedRendezVous &&
              this.formatDateWithoutUTC(new Date(this.selectedRendezVous.date)) === date &&
              this.selectedRendezVous.heure === heure;

            return rdv.status !== 'ANNULLEE' && !isEditing;
          })
          .map(rdv => ({
            date: rdv.date.slice(0, 10),
            heure: rdv.heure.slice(0, 5)
          }));

        if (this.form.get('date')?.value) {
          this.onDateChange({ value: this.form.get('date')?.value });
        }
      },
      error: (err) => console.error('Erreur lors du chargement des créneaux:', err)
    });
  }

  loadMesRendezVous() {
    this.customerService.getMesRendezVous(this.userId).subscribe({
      next: (res) => {
        this.rendezvousList = res.map(rdv => ({
          ...rdv,
          date: rdv.date.split('T')[0],
          heure: rdv.heure.substring(0, 5)
        }));
      },
      error: () => this.snackbar.open('Erreur lors du chargement des rendez-vous', 'Fermer', { duration: 3000 })
    });
  }

  onDateChange(event: any) {
    const selectedDate = this.extractDate(event.value);
    const reservedHours = this.reservedSlots.filter(slot => slot.date === selectedDate).map(slot => slot.heure);
    this.availableHours = this.allHours.filter(hour => !reservedHours.includes(hour));
    this.form.get('heure')?.reset();
  }

  onHourChange(selectedHour: string) {
    const selectedDate = this.extractDate(this.form.get('date')?.value);
    this.isSlotTaken = this.reservedSlots.some(slot => slot.date === selectedDate && slot.heure === selectedHour);
    if (this.isSlotTaken) {
      this.snackbar.open('❌ Cette heure est déjà réservée', 'Fermer', { duration: 4000 });
      this.form.get('heure')?.reset();
    }
  }

  extractDate(value: any): string {
    if (!value) return '';
    if (value instanceof Date) return this.formatDateWithoutUTC(value);
    return typeof value === 'string' ? value.split('T')[0] : '';
  }

  submitForm() {
    if (this.form.invalid || this.userId === 0 || this.isSlotTaken) {
      this.snackbar.open('❌ Formulaire invalide ou créneau déjà réservé', 'Fermer', { duration: 4000 });
      return;
    }
  
    const rawDate = this.form.get('date')?.value; // ⚡ On prend directement la valeur du picker
    let formattedDate: string;
  
    if (rawDate instanceof Date) {
      formattedDate = this.formatDateWithoutUTC(rawDate); // ⚡ Correction ici
    } else {
      formattedDate = rawDate.split('T')[0]; // ⚡ Si déjà string
    }
  
    const dto = {
      date: formattedDate,  // ✅ On envoie le vrai jour sans UTC
      heure: this.form.value.heure + ':00'
    };
  
    this.http.post(`http://localhost:8081/api/rendezvous/auth/${this.userId}`, dto, { responseType: 'text' as 'json' })
      .subscribe({
        next: () => {
          this.snackbar.open('✅ Rendez-vous confirmé', 'Fermer', { duration: 3000 });
          this.form.reset();
          this.availableHours = [];
          this.loadReservedSlots();
          this.loadMesRendezVous();
        },
        error: (err) => {
          const msg = err.status === 400 || err.status === 500
            ? (err.error.includes('déjà réservées') ? '❌ Ce créneau est déjà réservé' : '❌ Erreur serveur')
            : '❌ Erreur lors de l\'enregistrement';
          this.snackbar.open(msg, 'Fermer', { duration: 4000 });
        }
      });
  }
  
  
  // ✅ Nouvelle fonction correcte

  

  resetForm() {
    this.form.reset();
    this.selectedRendezVous = null;
    this.availableHours = [];
    this.loadReservedSlots();
    this.loadMesRendezVous();
  }

  formatDateWithoutUTC(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  annulerRendezVous(rdvId: number): void {
    if (!rdvId || !this.userId) return;
    this.customerService.annulerRendezVous(rdvId, this.userId).subscribe({
      next: () => {
        this.snackbar.open('✅ Rendez-vous annulé', 'Fermer', { duration: 3000 });
        this.loadMesRendezVous();
        this.loadReservedSlots();
      },
      error: () => this.snackbar.open('❌ Erreur lors de l\'annulation', 'Fermer', { duration: 3000 })
    });
  }

  modifierRendezVous(rdv: any) {
    this.selectedRendezVous = { ...rdv, date: new Date(rdv.date) };
    this.form.patchValue({
      date: this.selectedRendezVous.date,
      heure: this.selectedRendezVous.heure
    });
    this.loadReservedSlots();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getReservedHoursForSelectedDate(): string[] {
    const dateValue = this.form.get('date')?.value;
    const selectedDate = dateValue instanceof Date
      ? this.formatDateWithoutUTC(dateValue)
      : dateValue?.split('T')[0];

    return this.reservedSlots
      .filter(slot => slot.date === selectedDate)
      .map(slot => slot.heure);
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}