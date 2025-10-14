import { Component } from '@angular/core';

@Component({
  selector: 'app-ledouceur',
  standalone: false,
  templateUrl: './ledouceur.component.html',
  styleUrl: './ledouceur.component.css'
})
export class LedouceurComponent {
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
