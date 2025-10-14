import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../service/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-update-product',
  standalone:false,
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
  export class UpdateProductComponent implements OnInit {
    productForm!: FormGroup;
    serviceId!: number;
    allCategories: any[] = [];
    filteredCategories: any[] = [];
        prestataires: any[] = [];
    file: File | null = null;
    imagePreview: string | ArrayBuffer | null = null;
    existingImage: string | null = null;
    unavailableDates: Date[] = [];
    selectedDate: Date | null = null;
    isProdSelected = true;
    showSidebar = false;

    


    constructor(
      private fb: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private adminService: AdminService,
      private authService: AuthService,
      private snackbar: MatSnackBar
    ) {}
  
    ngOnInit(): void {
      this.serviceId = +this.route.snapshot.params['serviceId']; // Ensure serviceId is a number
      this.initForm();
      this.loadCategories();
      this.loadPrestataires();
      this.loadServiceDetails();
    }
    private filterCategories(): void {
      const type = this.productForm.get('afficherDans')?.value;
      this.filteredCategories = this.allCategories.filter(cat => cat.type === type);
    
      // ✅ Réinitialise la catégorie si elle ne correspond plus
      const selectedCatId = this.productForm.get('categoryId')?.value;
      const isStillValid = this.filteredCategories.some(cat => cat.id === selectedCatId);
      if (!isStillValid) {
        this.productForm.get('categoryId')?.reset();
      }
    }
    
    private initForm(): void {
      this.productForm = this.fb.group({
        nom: [null, Validators.required],
        description: [null, Validators.required],
        categoryId: [null, Validators.required],
        afficherDans: ['prod', Validators.required],
        prix: [null],
        prestataireId: [null],
        unavailableDates: [[]]
      });
    
      // Initialiser l'état prod/events
      this.isProdSelected = this.productForm.get('afficherDans')?.value === 'prod';
    
      // Validators dynamiques + filtrage des catégories
      this.productForm.get('afficherDans')?.valueChanges.subscribe(type => {
        this.isProdSelected = type === 'prod';
        this.updateFormValidators();     // gérer champs obligatoires
        this.filterCategories();         // filtrer les catégories dynamiquement
      });
    }
    
  
    private updateFormValidators(): void {
      const prixControl = this.productForm.get('prix');
      const prestataireControl = this.productForm.get('prestataireId');
  
      if (this.isProdSelected) {
        prixControl?.clearValidators();
        prestataireControl?.clearValidators();
      } else {
        prixControl?.setValidators([Validators.required, Validators.min(0)]);
        prestataireControl?.setValidators([Validators.required]);
      }
  
      prixControl?.updateValueAndValidity();
      prestataireControl?.updateValueAndValidity();
    }
  
    loadCategories(): void {
      this.adminService.getAllCategory().subscribe({
        next: (res) => {
          this.allCategories = res;
          this.filterCategories(); // filtre selon valeur actuelle de afficherDans
        },
        error: (err) => {
          console.error('Error loading categories:', err);
          this.snackbar.open('Erreur lors du chargement des catégories', 'Fermer', { duration: 5000 });
        }
      });
    }
    
  
    loadPrestataires(): void {
      this.authService.getAllPrestataires().subscribe({
        next: (res) => {
          this.prestataires = res;
          console.log('Prestataires loaded:', res);
        },
        error: (err) => {
          console.error('Error loading prestataires:', err);
          this.snackbar.open('Erreur lors du chargement des prestataires', 'Fermer', { duration: 5000 });
        }
      });
    }
  
    loadServiceDetails(): void {
      this.adminService.getServiceById(this.serviceId).subscribe({
        next: (service) => {
          console.log('📦 Service details loaded:', service);
    
          // Détection du type
          const type = service.afficherDans || 'prod';
          this.isProdSelected = type === 'prod';
    
          // Patch des valeurs dans le formulaire
          this.productForm.patchValue({
            nom: service.nom || service.name,
            description: service.description,
            categoryId: service.categoryId,
            afficherDans: type,
            prix: service.prix,
            prestataireId: service.prestataireId
          });
    
          // Image preview
          if (service.base64Img) {
            this.existingImage = 'data:image/jpeg;base64,' + service.base64Img;
          } else if (service.returnedImg) {
            this.existingImage = 'data:image/jpeg;base64,' + service.returnedImg;
          }
    
          // Dates d'indisponibilité (si events)
          this.unavailableDates = (service.unavailableDateTimes || service.unavailableDates || [])
            .map((d: string) => new Date(d))
            .filter((d: Date) => !isNaN(d.getTime())); // filtre les dates invalides
    
          // Appliquer validation dynamique & filtrage des catégories
          this.updateFormValidators();
          this.filterCategories();
    
        },
        error: (err) => {
          console.error('❌ Erreur chargement service :', err);
          this.snackbar.open('Erreur lors du chargement du service', 'Fermer', { duration: 5000 });
          this.router.navigate(['/admin/dashboard']);
        }
      });
    }
    
  
    onFileSelected(event: any): void {
      const file = event.target.files[0];
      if (file) {
        this.file = file;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
  
    onDateChange(date: Date): void {
      this.selectedDate = date;
    }
  
    addDateTime(timeInput: HTMLInputElement): void {
      if (!this.selectedDate || !timeInput.value) return;
  
      const [hours, minutes] = timeInput.value.split(':').map(Number);
      const dateTime = new Date(this.selectedDate);
      dateTime.setHours(hours, minutes);
  
      if (!this.unavailableDates.some(d => d.getTime() === dateTime.getTime())) {
        this.unavailableDates.push(dateTime);
        timeInput.value = '';
        this.selectedDate = null;
      }
    }
  
    removeDate(index: number): void {
      this.unavailableDates.splice(index, 1);
    }
    updateProduct(): void {
      if (this.productForm.invalid) return;
    
      const formData = new FormData();
      const formValue = this.productForm.value;
    
      formData.append('name', formValue.nom);
      formData.append('description', formValue.description);
      formData.append('categoryId', formValue.categoryId);
    
      if (!this.isProdSelected) {
        formData.append('prix', formValue.prix);
        formData.append('prestataireId', formValue.prestataireId);
    

          formData.append('unavailableDates', JSON.stringify(
            this.unavailableDates.map(d => this.formatDateTimeLocal(d))
          ));
          
        
      }
    
      if (this.file) {
        formData.append('img', this.file);
      }
    
      this.adminService.updateProduct(this.serviceId, formData, formValue.afficherDans).subscribe({
        next: () => {
          this.snackbar.open('Service mis à jour avec succès !', 'Fermer', { duration: 4000 });
          this.router.navigate(['/admin/dashboard']);
        },
        error: (err) => {
          console.error('Update Error:', err);
          this.snackbar.open('Échec de mise à jour !', 'Fermer', { duration: 5000 });
        }
      });
    }
    private formatDateTimeLocal(date: Date): string {
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
    }
      
  
    GoDashboard(): void {
      this.router.navigate(['/admin/dashboard']);
    }
  }