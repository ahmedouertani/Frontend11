import { Component } from '@angular/core';

@Component({
  selector: 'app-innovas',
  standalone: false,
  templateUrl: './innovas.component.html',
  styleUrl: './innovas.component.css'
})
export class InnovasComponent {
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

