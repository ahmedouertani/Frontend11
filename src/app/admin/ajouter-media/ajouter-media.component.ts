import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ajouter-media',
  standalone: false,
  templateUrl: './ajouter-media.component.html',
  styleUrl: './ajouter-media.component.css'
})
export class AjouterMediaComponent implements OnInit{
  serviceId!: number;
  images: File[] = [];
  videos: File[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.serviceId = Number(this.route.snapshot.paramMap.get('id'));
  }

  onImagesSelected(event: any) {
    this.images = Array.from(event.target.files);
  }

  onVideosSelected(event: any) {
    this.videos = Array.from(event.target.files);
  }

  uploadMedia() {
    const formData = new FormData();

    for (let image of this.images) {
      formData.append('images', image);
    }

    for (let video of this.videos) {
      formData.append('videos', video);
    }

    this.http.post(`http://localhost:8081/api/admin/service-media/${this.serviceId}/media`, formData)
    .subscribe({
      next: (res: any) => {
        this.snackbar.open(res.message || '✅ Médias ajoutés avec succès', 'Fermer', { duration: 3000 });
      },
      error: err => {
        const message = err.error?.message || 'Une erreur est survenue';
        this.snackbar.open('Erreur : ' + message, 'Fermer', { duration: 4000 });
      }
    });
  
}}