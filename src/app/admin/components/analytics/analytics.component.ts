import { Component, ViewChild } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-analytics',
  standalone: false,
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css'
})
export class AnalyticsComponent {
  data: any;
  eventAnalytics: any;
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  // Initialisation des labels
  revenueChartLabels: string[] = ['Mois Précédent', 'Mois Actuel', 'Total Annuel'];
  reservationChartLabels: string[] = ['En Attente', 'Annulées', 'Acceptées'];

  revenueChart: any = {
    labels: this.revenueChartLabels,
    datasets: []
  };

  reservationChart: any = {
    labels: this.reservationChartLabels,
    datasets: []
  };

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      }
    }
  };

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.adminService.getAnalytics().subscribe(res => {
      this.data = res;
      this.setReservationChartData();
    });

    this.adminService.getAnalyticsEvents().subscribe(res => {
      this.eventAnalytics = res;
      this.setRevenueChartData();
    });
  }

  setRevenueChartData() {
    this.revenueChart = {
      labels: this.revenueChartLabels,
      datasets: [
        {
          label: 'Recettes (TND)',
          data: [
            this.eventAnalytics?.previousMonthEarning || 0,
            this.eventAnalytics?.currentMonthEarning || 0,
            this.eventAnalytics?.totalYearEarning || 0
          ],
          backgroundColor: ['#4caf50', '#2196f3', '#ff9800']
        }
      ]
    };
  }

  setReservationChartData() {
    this.reservationChart = {
      labels: this.reservationChartLabels,
      datasets: [
        {
          label: 'Réservations',
          data: [
            this.data?.recue || 0,  // En Attente
            this.data?.annullee || 0,  // Annulées
            this.data?.acceptee || 0  // Acceptées
          ],
          backgroundColor: ['#ffc107', '#f44336', '#4caf50'],  // Couleurs pour chaque secteur
          hoverBackgroundColor: ['#ffca28', '#f55d45', '#66bb6a'],  // Couleurs au survol
          borderWidth: 0  // Pas de bordure
        }
      ]
    };
  }
  
}
