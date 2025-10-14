import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CollabService, Collab } from '../../services/collab.service';

@Component({
  selector: 'app-collab',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './collab.component.html',
  styleUrls: ['./collab.component.css']
})
export class CollabComponent implements OnInit {
  collaborations: Collab[] = [];
  newCollab: Collab = { nom: '', logo: '', description: '', gallery: [] };
  showForm = false;
  editingIndex: number | null = null;

  constructor(private collabService: CollabService) {}

  ngOnInit() {
    this.loadCollabs();
  }

  // Charger les collaborations depuis backend
  loadCollabs() {
    this.collabService.getAll().subscribe(data => this.collaborations = data);
  }

  // Upload logo
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.newCollab.logo = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  // Upload galerie
onGallerySelected(event: any) {
  const files: FileList = event.target.files;
  this.newCollab.gallery = [];

  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.newCollab.gallery?.push(e.target.result); // Base64 مباشرة
    };
    reader.readAsDataURL(file);
  });
}

  // Ajouter ou Mettre à jour
  addCollab() {
    if (this.editingIndex === null) {
      // CREATE
      this.collabService.addCollab(this.newCollab).subscribe(() => {
        this.loadCollabs();
        this.resetForm();
      });
    } else {
      // UPDATE
      const id = this.collaborations[this.editingIndex].id;
      if (id) {
        this.collabService.updateCollab(id, this.newCollab).subscribe(() => {
          this.loadCollabs();
          this.resetForm();
        });
      }
    }
  }
  confirmDelete(index: number) {
    const collabName = this.collaborations[index].nom;
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${collabName}?`)) {
      this.deleteCollab(index);
    }
  }
  // Supprimer
  deleteCollab(index: number) {
    const id = this.collaborations[index].id;
    if (id) {
      this.collabService.deleteCollab(id).subscribe(() => this.loadCollabs());
    }
  }
  // Modifier
  editCollab(index: number) {
    this.editingIndex = index;
    this.newCollab = { ...this.collaborations[index] };
    if (!this.newCollab.gallery) {
      this.newCollab.gallery = [];
    }
    this.showForm = true;
  }

  // Reset form
  resetForm() {
    this.newCollab = { nom: '', logo: '', description: '', gallery: [] };
    this.showForm = false;
    this.editingIndex = null;
  }
}
