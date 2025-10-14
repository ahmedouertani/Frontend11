import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserStorageService } from '../../../services/storage/user-storage.service';
import { CustomerService } from '../../services/customer.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CartComponent } from '../dashboard/cart/cart.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-prod',
  standalone: false,
  templateUrl: './prod.component.html',
  styleUrl: './prod.component.css'
})
export class ProdComponent {
  products:any[]=[];
  searchProductForm!:FormGroup;
  images: any[] = [];

  constructor(private customerService: CustomerService,
    private fb:FormBuilder,
    private snackbar: MatSnackBar,
    private http: HttpClient
  ){}

  ngOnInit(): void {
    this.getAllProducts(); // appel initial pour charger les produits
  
    // Initialisation du formulaire de recherche
    this.searchProductForm = this.fb.group({
      title: [null, Validators.required]
    });
  
    // Récupération des images du prestataire
    const prestataireId = 1; // À remplacer dynamiquement plus tard
    this.http.get(`http://localhost:8081/images/prestataire/${prestataireId}`).subscribe((res: any) => {
      this.images = res;
    });
  }
  
  getAllProducts() {
    this.products = [];
    this.customerService.getAllProducts().subscribe(
      res => {
        res.forEach(element => {
          element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
          this.products.push(element);
        });
        console.log(this.products);
      },
      error => {
        console.error('Erreur lors de la récupération des produits:', error);
        this.snackbar.open('Erreur lors de la récupération des produits', 'Fermer', { duration: 5000 });
      }
    );
  }
  

  submitForm() {
    this.products = [];
    const title = this.searchProductForm.get('title')!.value;
  
    // Assurez-vous d'avoir le bon format pour le nom
    this.customerService.getAllProductByName(title).subscribe(res => {
      res.forEach(element => {
        element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
        this.products.push(element);
      });
      console.log(this.products);
    });
  }


  
  addToCart(id: any): void {
    this.customerService.addToCart(id).subscribe(
      () => {
        this.snackbar.open('Produit ajouté au panier avec succès', 'Fermer', { duration: 3000 });
        this.customerService.getCartByUserId().subscribe(); // actualisation
      },
      () => {
        this.snackbar.open('Erreur lors de l\'ajout du produit au panier', 'Fermer', { duration: 3000 });
      }
    );
  }
}
