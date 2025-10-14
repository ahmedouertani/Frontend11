import { Component } from '@angular/core';

@Component({
  selector: 'app-darmarwa',
  standalone: false,
  templateUrl: './darmarwa.component.html',
  styleUrl: './darmarwa.component.css'
})
export class DarmarwaComponent {
  showLightbox: boolean = false;
  lightboxImage: string = '';

  openLightbox(imageSrc: string) {
    this.lightboxImage = imageSrc;
    this.showLightbox = true;
  }

  closeLightbox() {
    this.showLightbox = false;
  }
}
