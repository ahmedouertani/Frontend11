import { Component } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { UserStorageService } from '../../../services/storage/user-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profilecard',
  standalone: false,
  templateUrl: './profilecard.component.html',
  styleUrl: './profilecard.component.css'
})
export class ProfilecardComponent {
  nom: string = '';
  role: string = '';
  img: string = '';
  defaultImage = 'assets/default-user.png';

  constructor(private customerService: CustomerService,private router :Router) {}

  ngOnInit(): void {
    const userId = Number(UserStorageService.getUserId());
    this.customerService.getProfile(userId).subscribe({
      next: (res) => {
        this.nom = res.nom;
        this.role = res.role; // ex: 'CLIENT', 'ADMIN', 'PRESTATAIRE'
        this.img = res.img
          ? (res.img.startsWith('data:image') ? res.img : `data:image/jpeg;base64,${res.img}`)
          : '';
      },
      error: (err) => {
        console.error('Erreur lors du chargement du profil', err);
      }
    });
  }
updateProfile(){
  this.router.navigateByUrl['customer/profile']
}

}