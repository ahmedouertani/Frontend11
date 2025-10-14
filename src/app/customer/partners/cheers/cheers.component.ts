import { Component } from '@angular/core';

@Component({
  selector: 'app-cheers',
  standalone: false,
  templateUrl: './cheers.component.html',
  styleUrl: './cheers.component.css'
})
export class CheersComponent {
  images = [
    'assets/partenaires/cheers/affiche1.webp',
    'assets/partenaires/cheers/affiche2.webp',
    'assets/partenaires/cheers/affiche3.webp',
    'assets/partenaires/cheers/affiche4.webp'
  ];
  showLightbox: boolean = false;
  lightboxImage: string = '';

  openLightbox(imageSrc: string): void {
    this.lightboxImage = imageSrc;
    this.showLightbox = true;
  }

  closeLightbox(): void {
    this.showLightbox = false;
  }
}
