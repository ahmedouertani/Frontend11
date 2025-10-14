import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../service/admin.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

const BASIC_URL = "http://localhost:8081/api/admin";

@Component({
  selector: 'app-post-product',
  standalone: false,
  templateUrl: './post-product.component.html',
  styleUrls: ['./post-product.component.css']
})
export class PostProductComponent implements OnInit {
  productForm: FormGroup;
  listOfCategories: any[] = [];
  imagePreview: string | ArrayBuffer | null = null;
  file: File | null = null;
  showSidebar = false;
  unavailableDateTimes: string[] = [];
  prestataires: any[] = [];
  selectedDate: Date | null = null;
  isSubmitting = false;
  allCategories: any[] = []; // toutes les catégories
  filteredCategories: any[] = []; // catégories filtrées selon le type sélectionné
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private adminService: AdminService,
    private authService: AuthService
  ) {
    this.productForm = this.fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      categoryId: [null, Validators.required],
      afficherDans: ['prod', Validators.required],
      prix: [null],
      prestataireId: [null],
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.loadData();
  }

  private initForm(): void {
    this.setupConditionalValidation();
  }

  private setupConditionalValidation(): void {
    const afficherDansControl = this.productForm.get('afficherDans');
    const prixControl = this.productForm.get('prix');
    const prestataireControl = this.productForm.get('prestataireId');
  
    if (!afficherDansControl || !prixControl || !prestataireControl) return;
  
    afficherDansControl.valueChanges.subscribe((type: 'prod' | 'events') => {
      // ✅ Appliquer les validators selon le type
      if (type === 'events') {
        prixControl.setValidators([Validators.required, Validators.min(0)]);
        prestataireControl.setValidators(Validators.required);
      } else {
        prixControl.clearValidators();
        prestataireControl.clearValidators();
        this.clearDates(); // Supprimer les dates si on revient à prod
      }
  
      // ✅ Mise à jour des statuts
      prixControl.updateValueAndValidity();
      prestataireControl.updateValueAndValidity();
  
      // ✅ Filtrer dynamiquement les catégories selon type sélectionné
      this.filterCategories();
  
      // ✅ Réinitialiser la catégorie sélectionnée si elle ne correspond pas au nouveau type
      const selectedCatId = this.productForm.get('categoryId')?.value;
      const isValidCat = this.filteredCategories.some(cat => cat.id === selectedCatId);
      if (!isValidCat) {
        this.productForm.get('categoryId')?.reset();
      }
    });
  
    // Appeler manuellement au chargement initial
    this.filterCategories();
  }
  

  private loadData(): void {
    this.adminService.getAllCategory().subscribe({
      next: (res) => {
        this.allCategories = res;
        this.filterCategories(); // filtre dès le début (valeur par défaut = 'prod')
      },
      error: () => this.showError('Erreur de chargement des catégories')
    });
  
    this.authService.getAllPrestataires().subscribe({
      next: (res) => this.prestataires = res,
      error: () => this.showError('Erreur de chargement des prestataires')
    });
  }
  private filterCategories(): void {
    const type = this.productForm.get('afficherDans')?.value;
    this.filteredCategories = this.allCategories.filter(cat => cat.type === type);
  }
  
  get isProdSelected(): boolean {
    return this.productForm.get('afficherDans')?.value === 'prod';
  }

  get isEventsSelected(): boolean {
    return this.productForm.get('afficherDans')?.value === 'events';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      if (!file.type.match('image.*')) {
        this.showError('Seules les images sont acceptées');
        return;
      }
      
      this.file = file;
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  onDateChange(date: Date): void {
    this.selectedDate = date;
  }

  onTimeChange(event: Event): void {
    if (!this.selectedDate || !this.isEventsSelected) return;
  
    const input = event.target as HTMLInputElement;
    if (!input.value) return;
  
    const [hours, minutes] = input.value.split(':');
    if (!hours || !minutes) {
      this.showError('Format d\'heure invalide');
      return;
    }
  
    const year = this.selectedDate.getFullYear();
    const month = (this.selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = this.selectedDate.getDate().toString().padStart(2, '0');
  
    const formattedDateTime = `${year}-${month}-${day}T${hours.padStart(2, '0')}:${minutes}:00`;
    this.unavailableDateTimes.push(formattedDateTime);
  }
  
  removeDateTime(index: number): void {
    this.unavailableDateTimes.splice(index, 1);
  }

  clearDates(): void {
    this.unavailableDateTimes = [];
  }

  addProduct(): void {
    if (this.productForm.invalid || this.isSubmitting) {
      this.showError('Formulaire invalide');
      return;
    }
  
    this.isSubmitting = true;
    const loadingSnackbar = this.snackBar.open('Envoi en cours...', 'Fermer');
  
    const formData = new FormData();
    const serviceType = this.productForm.value.afficherDans;
  
    // Champs communs
    formData.append('categoryId', this.productForm.value.categoryId);
    formData.append('name', this.productForm.value.name);
    formData.append('description', this.productForm.value.description);
  
    // Champs spécifiques à "events"
    if (serviceType === 'events') {
      formData.append('prix', this.productForm.value.prix);
      formData.append('prestataireId', this.productForm.value.prestataireId);
  
      if (this.unavailableDateTimes.length) {
        formData.append('unavailableDates', JSON.stringify(this.unavailableDateTimes));
      }
    }
  
    // Ajout de l'image si présente
    if (this.file) {
      formData.append('img', this.file);
    }
  
    // Envoi
    this.adminService.addProduct(formData, `service/${serviceType}`).subscribe({
      next: () => {
        loadingSnackbar.dismiss();
        this.snackBar.open('Service créé avec succès', 'OK', { duration: 3000 });
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.isSubmitting = false;
        loadingSnackbar.dismiss();
        const errorMessage = err.error?.message || 'Erreur lors de la création';
        this.showError(errorMessage);
      }
    });
  }
  
  private showError(message: string): void {
    this.snackBar.open(message, 'Fermer', { 
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }

  public navigateTo(path: string): void {
    this.router.navigate([path]);
  }


}