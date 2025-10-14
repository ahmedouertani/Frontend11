import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-upload-image-prestataire',
  standalone: false,
  templateUrl: './upload-image-prestataire.component.html',
  styleUrl: './upload-image-prestataire.component.css'
})
export class UploadImagePrestataireComponent {
 
  prestataireId!: number;
  selectedFile!: File;
  images: any[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.prestataireId = +this.route.snapshot.paramMap.get('id')!;
    this.loadImages();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  upload(): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post(`http://localhost:8081/prestataire/images/upload/${this.prestataireId}`, formData).subscribe({
      next: () => {
        this.selectedFile = undefined!;
        this.loadImages();
      },
      error: err => {
        console.error('Erreur upload:', err);
        alert('Erreur lors de l\'upload');
      }
    });
  }

  loadImages(): void {
    this.http.get<any[]>(`http://localhost:8081/prestataire/images/${this.prestataireId}`).subscribe(images => {
      this.images = images;
    });
  }
}
