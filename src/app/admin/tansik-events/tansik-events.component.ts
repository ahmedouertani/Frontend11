import { Component, OnInit } from '@angular/core';
import { AdminService } from '../service/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tansik-events',
  standalone: false,
  templateUrl: './tansik-events.component.html',
  styleUrl: './tansik-events.component.css'
})
export class TansikEventsComponent {
  showSidebar = false;

  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }
}