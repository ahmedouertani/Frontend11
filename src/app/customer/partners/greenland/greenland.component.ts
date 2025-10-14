import { Component } from '@angular/core';

@Component({
  selector: 'app-greenland',
  standalone: false,
  templateUrl: './greenland.component.html',
  styleUrl: './greenland.component.css'
})
export class GreenlandComponent {
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
