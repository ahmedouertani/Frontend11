import { Component } from '@angular/core';

@Component({
  selector: 'app-omega',
  standalone: false,
  templateUrl: './omega.component.html',
  styleUrl: './omega.component.css'
})
export class OmegaComponent {
  showLightbox = false;
  lightboxImage = '';

  images = [
    'assets/partenaires/omega/affiche1.webp',
    'assets/partenaires/omega/affiche2.webp',
    'assets/partenaires/omega/affiche3.webp',
    'assets/partenaires/omega/affiche4.webp'
    
  ];

  openLightbox(imageUrl: string) {
    this.lightboxImage = imageUrl;
    this.showLightbox = true;
  }

  closeLightbox() {
    this.showLightbox = false;
  }
}
