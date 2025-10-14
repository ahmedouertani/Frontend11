import { Component } from '@angular/core';

@Component({
  selector: 'app-parakhouloud',
  standalone: false,
  templateUrl: './parakhouloud.component.html',
  styleUrl: './parakhouloud.component.css'
})
export class ParakhouloudComponent {
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

