import { Component } from '@angular/core';

@Component({
  selector: 'app-tansik-prod',
  standalone: false,
  templateUrl: './tansik-prod.component.html',
  styleUrl: './tansik-prod.component.css'
})
export class TansikProdComponent {
  showSidebar = false;

  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }
}
