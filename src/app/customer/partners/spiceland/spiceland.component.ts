import { Component } from '@angular/core';

@Component({
  selector: 'app-spiceland',
  standalone: false,
  templateUrl: './spiceland.component.html',
  styleUrl: './spiceland.component.css'
})
export class SpicelandComponent {
  showLightbox = false;
  lightboxImage: string = '';

  openLightbox(img: string) {
    this.lightboxImage = img;
    this.showLightbox = true;
  }

  closeLightbox() {
    this.showLightbox = false;
  }
}
