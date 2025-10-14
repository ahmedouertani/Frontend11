import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../service/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-category',
  standalone: false,
  templateUrl: './post-category.component.html',
  styleUrls: ['./post-category.component.css']
})
export class PostCategoryComponent implements OnInit {
  categoryForm!: FormGroup;
  categories: any[] = [];   // ✅ tableau pour stocker les catégories
  showSidebar = false;

  iconSuggestions: string[] = [
    'fas fa-cogs', 'fas fa-users-cog', 'fas fa-bullhorn', 'fas fa-print',
    'fas fa-chess', 'fas fa-camera', 'fas fa-lightbulb', 'fas fa-magic',
    'fas fa-rocket', 'fas fa-palette', 'fas fa-briefcase', 'fas fa-laptop-code'
  ];

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      iconClass: ['fas fa-cogs'], // valeur par défaut
      type: ['prod', [Validators.required]] // valeur par défaut
    });

    this.loadCategories(); // ✅ charger les catégories existantes
  }

  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }

  loadCategories(): void {
    this.adminService.getAllCategories().subscribe((res) => {
      this.categories = res;
    });
  }

  addCategory(): void {
    if (this.categoryForm.valid) {
      this.adminService.addCategory(this.categoryForm.value).subscribe((res) => {
        if (res.id != null) {
          this.snackBar.open('Catégorie ajoutée avec succès !', 'CLOSE', { duration: 5000 });
          this.loadCategories(); // ✅ rafraîchir la liste
          this.categoryForm.reset({
            name: '',
            description: '',
            iconClass: 'fas fa-cogs',
            type: 'prod'
          });
        } else {
          this.snackBar.open(res.message, 'CLOSE', {
            duration: 5000,
            panelClass: 'error-snakbar'
          });
        }
      });
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }

  updatePreviewIcon(): void {
    // Forcer l’aperçu si besoin
  }

  selectIcon(iconClass: string): void {
    this.categoryForm.get('iconClass')?.setValue(iconClass);
  }

  
  deleteCategory(cat: any): void {
  console.log('🔍 Deleting category with ID:', cat.id);

  if (confirm(`Supprimer la catégorie "${cat.name}" ?`)) {
    this.adminService.deleteCategory(cat.id).subscribe({
      next: () => {
        console.log('✅ Delete successful');
        this.snackBar.open('Catégorie supprimée avec succès.', 'FERMER', { duration: 3000 });
        this.categories = this.categories.filter(c => c.id !== cat.id); // UI update without refresh
      },

      error: (err) => {
        console.error('❌ Delete error:', err);
        this.snackBar.open('Erreur lors de la suppression.', 'FERMER', {
          duration: 3000,
          panelClass: 'error-snakbar'
        });
      }
    });
  }
}



  
}
