import { Component, OnInit } from '@angular/core';
import { AdminService } from '../service/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-rendez-vous',
  standalone:false,
  templateUrl: './rendez-vous.component.html',
  styleUrls: ['./rendez-vous.component.css']
})
export class RendezVousComponent implements OnInit {
  rendezvousList: any[] = [];
  isLoading = false;

  constructor(private adminService: AdminService, private snackbar: MatSnackBar) {}

  ngOnInit(): void {
    this.fetchRendezvous();
  }

  fetchRendezvous() {
    this.isLoading = true;
    this.adminService.getAllRendezVous().subscribe({
      next: (data) => {
        this.rendezvousList = data.map(rdv => ({
          ...rdv,
          date: typeof rdv.date === 'string' ? rdv.date.split('T')[0] : '',
          heure: typeof rdv.heure === 'string' ? rdv.heure.substring(0, 5) : ''
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement rendez-vous:', err);
        this.snackbar.open('Erreur lors du chargement', 'Fermer', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  accepterRendezVous(rdvId: number) {
    this.adminService.confirmerRendezVousByAdmin(rdvId).subscribe({
      next: () => {
        this.snackbar.open('✅ Rendez-vous confirmé', 'Fermer', { duration: 3000 });
        this.fetchRendezvous();
      },
      error: (err) => {
        console.error('Erreur confirmation:', err);
        this.snackbar.open('❌ Erreur lors de la confirmation', 'Fermer', { duration: 3000 });
      }
    });
  }

  annulerRendezVous(rdvId: number) {
    this.adminService.annulerRendezVousByAdmin(rdvId).subscribe({
      next: () => {
        this.snackbar.open('✅ Rendez-vous annulé', 'Fermer', { duration: 3000 });
        this.fetchRendezvous();
      },
      error: (err) => {
        console.error('Erreur annulation:', err);
        this.snackbar.open('❌ Erreur lors de l\'annulation', 'Fermer', { duration: 3000 });
      }
    });
  }
}
