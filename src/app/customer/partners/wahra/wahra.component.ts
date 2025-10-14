import { Component } from '@angular/core';

@Component({
  selector: 'app-wahra',
  standalone: false,
  templateUrl: './wahra.component.html',
  styleUrl: './wahra.component.css'
})
export class WahraComponent {
  showLightbox = false;
  lightboxImage = '';

  openLightbox(image: string) {
    this.showLightbox = true;
    this.lightboxImage = image;
  }

  closeLightbox() {
    this.showLightbox = false;
  }
}
