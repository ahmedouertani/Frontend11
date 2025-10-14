import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { AdminService } from '../../../admin/service/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserStorageService } from '../../../services/storage/user-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rendez-vous',
  standalone: false,
  templateUrl: './rendez-vous.component.html',
  styleUrls: ['./rendez-vous.component.css']
})
export class RendezVousComponent implements OnInit {

  form!: FormGroup;
  reservedSlots: { date: string; heure: string }[] = [];
  availableHours: string[] = [];
  isSlotTaken = false;
  rendezvousList: any[] = [];
  userId: number = 0;
  allHours: string[] = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private adminService: AdminService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.checkUserLogin();
    this.loadReservedSlots();
  }

private initializeForm(): void {
  this.form = this.fb.group({
    nom: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [
      Validators.required,
      Validators.pattern(/^.+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|live\.com)$/)
    ]],
    telephone: ['', [Validators.required, Validators.pattern(/^\d{8,}$/)]],
    date: ['', [Validators.required, this.futureDateValidator]], // ✅
    heure: ['', Validators.required]
  });
}


  private checkUserLogin(): void {
    const id = UserStorageService.getUserId();
    console.log('User ID from storage:', id);

    if (id) {
      this.userId = Number(id);
      this.loadMesRendezVous();
    } else {
      this.userId = 0;
      console.warn('Aucun utilisateur connecté');
    }
  }

  loadReservedSlots(): void {
    this.adminService.getAllRendezVous().subscribe({
      next: (data) => {
        this.reservedSlots = data
          .filter((rdv: any) => rdv.status !== 'ANNULLEE')
          .map((rdv: any) => ({
            date: typeof rdv.date === 'string' ? rdv.date.slice(0, 10) : '',
            heure: typeof rdv.heure === 'string' ? rdv.heure.slice(0, 5) : ''
          }));
        console.log('Créneaux réservés chargés:', this.reservedSlots);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des créneaux:', err);
      }
    });
  }

  loadMesRendezVous(): void {
    if (this.userId <= 0) return;

    this.isLoading = true;
    this.customerService.getMesRendezVous(this.userId).subscribe({
      next: (res) => {
        console.log('Rendez-vous reçus:', res);
        this.rendezvousList = res.map((rdv: any) => ({
          ...rdv,
          date: this.extractDate(rdv.date),
          heure: rdv.heure.substring(0, 5)
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des rendez-vous:', err);
        this.snackbar.open('Erreur lors du chargement des rendez-vous', 'Fermer', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  onDateChange(event: any): void {
    const selectedDate = this.extractDate(event.value);
    const reservedHours = this.reservedSlots
      .filter(slot => slot.date === selectedDate)
      .map(slot => slot.heure);

    this.availableHours = this.allHours.filter(hour => !reservedHours.includes(hour));
    this.form.get('heure')?.reset();
  }

  onHourChange(selectedHour: string): void {
    const selectedDate = this.extractDate(this.form.get('date')?.value);
    this.isSlotTaken = this.reservedSlots.some(slot =>
      slot.date === selectedDate && slot.heure === selectedHour
    );

    if (this.isSlotTaken) {
      this.snackbar.open('❌ Cette heure est déjà réservée', 'Fermer', { duration: 3000 });
      this.form.get('heure')?.reset();
    }
  }

  getReservedHoursForSelectedDate(): string[] {
    const date = this.form.get('date')?.value;
    if (!date) return [];
    const formattedDate = this.extractDate(date);
    return this.reservedSlots
      .filter(slot => slot.date === formattedDate)
      .map(slot => slot.heure);
  }

  private extractDate(value: any): string {
    if (!value) return '';
    if (value instanceof Date) {
      const year = value.getFullYear();
      const month = (value.getMonth() + 1).toString().padStart(2, '0');
      const day = value.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return typeof value === 'string'
      ? value.split('T')[0]
      : '';
  }

  submit(): void {
    if (this.form.invalid || this.isSlotTaken) {
      this.snackbar.open('❌ Formulaire invalide ou créneau déjà réservé', 'Fermer', { duration: 3000 });
      return;
    }

    const dto = {
      nom: this.form.value.nom,
      email: this.form.value.email,
      telephone: this.form.value.telephone,
      date: this.extractDate(this.form.value.date),
      heure: this.form.value.heure,
      userId: this.userId > 0 ? this.userId : null
    };

    this.customerService.prendreRendezVousPublic(dto).subscribe({
      next: () => {
        this.snackbar.open('✅ Rendez-vous confirmé', 'Fermer', { duration: 3000 });
        this.form.reset();
        this.availableHours = [];
        this.loadReservedSlots();
        if (this.userId > 0) this.loadMesRendezVous();
      },
      error: (err) => {
        this.snackbar.open(err.error?.message || 'Erreur serveur', 'Fermer', { duration: 3000 });
      }
    });
  }

  onModifierRendezVous(rendezvousId: number): void {
    this.router.navigate(['/customer/modifier-rendezvous', rendezvousId]);
  }
  private futureDateValidator(control: any) {
  if (!control.value) return null;

  const selectedDate = new Date(control.value);
  const now = new Date();

  // نخلي التاريخ لازم يكون >= اليوم الحالي (من غير وقت)
  selectedDate.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  return selectedDate >= now ? null : { pastDate: true };
}

}
