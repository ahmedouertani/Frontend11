import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../admin/service/admin.service';
import { UserStorageService } from '../../services/storage/user-storage.service';

@Component({
  selector: 'app-dispos',
  standalone: false,
  templateUrl: './dispos.component.html',
  styleUrls: ['./dispos.component.css']
})
export class DisposComponent implements OnInit {
  selectedDates: Set<string> = new Set(); // Store as yyyy-MM-dd'T'HH:mm:ss
  currentDate: Date = new Date();
  timeGrid: Date[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUnavailableDates();
  }

  loadUnavailableDates(): void {
    const prestataireId = Number(UserStorageService.getUserId());
    this.selectedDates.clear();
    this.adminService.getServicesByPrestataireId(prestataireId).subscribe({
      next: (res) => {
        const dates = res.flatMap((s: any) => s.unavailableDateTimes || []);
        dates.forEach((d: string) => {
          const date = new Date(d);
          const localDateStr = this.formatLocalDateTime(date);
          this.selectedDates.add(localDateStr);
        });
        console.log('📥 Loaded selectedDates:', Array.from(this.selectedDates));
        this.generateTimeGrid();
      },
      error: (err) => {
        console.error('Error loading unavailable dates:', err);
        alert('❌ Erreur lors du chargement des disponibilités');
      }
    });
  }

  private formatLocalDateTime(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
  }

  generateTimeGrid(): void {
    this.timeGrid = [];
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    for (let day = 1; day <= 31; day++) {
      const baseDate = new Date(year, month, day);
      if (baseDate.getMonth() !== month) break;

      for (let hour = 0; hour <= 23; hour++) {
        const hourDate = new Date(year, month, day, hour, 0, 0, 0);
        this.timeGrid.push(hourDate);
      }
    }
  }

  isSelected(date: Date): boolean {
    return this.selectedDates.has(this.formatLocalDateTime(date));
  }

  toggle(date: Date): void {
    const localDateStr = this.formatLocalDateTime(date);
    console.log('🔄 Toggling date:', localDateStr, 'Current selectedDates:', Array.from(this.selectedDates));
    if (this.selectedDates.has(localDateStr)) {
      this.selectedDates.delete(localDateStr);
      console.log(`❌ Deselected ${localDateStr}, selectedDates:`, Array.from(this.selectedDates));
    } else {
      this.selectedDates.add(localDateStr);
      console.log(`✅ Selected ${localDateStr}, selectedDates:`, Array.from(this.selectedDates));
    }
  }

  prevMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateTimeGrid();
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateTimeGrid();
  }

  save(): void {
    const prestataireId = Number(UserStorageService.getUserId());
    const dates = Array.from(this.selectedDates);
    console.log('📤 Sending dates:', dates);

    this.adminService.updateAvailability(prestataireId, dates).subscribe({
      next: (response) => {
        console.log('✅ Update successful:', response);
        alert('✅ Disponibilité mise à jour !');
        this.loadUnavailableDates();
      },
      error: (err) => {
        console.error('❌ Update error:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          error: err.error
        });
        // Fallback to text response
        this.adminService.updateAvailabilityText(prestataireId, dates).subscribe({
          next: (textResponse) => {
            console.log('✅ Text update successful:', textResponse);
            alert('✅ Disponibilité mise à jour !');
            this.loadUnavailableDates();
          },
          error: (textErr) => {
            console.error('❌ Text update error:', {
              status: textErr.status,
              statusText: textErr.statusText,
              message: textErr.message,
              error: textErr.error
            });
            let errorMessage = `Erreur ${textErr.status}: ${textErr.statusText || 'Erreur inconnue'}`;
            if (textErr.error?.message) {
              errorMessage += ` - ${textErr.error.message}`;
            } else if (textErr.message) {
              errorMessage += ` - ${textErr.message}`;
            }
            alert(`❌ Erreur lors de la mise à jour: ${errorMessage}`);
          }
        });
      }
    });
  }
}