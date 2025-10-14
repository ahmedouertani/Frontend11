import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, MinLengthValidator } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-ajout-partenaire',
  standalone: false,
  templateUrl: './ajout-partenaire.component.html',
  styleUrl: './ajout-partenaire.component.css'
})
export class AjoutPartenaireComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [
        Validators.required,
        Validators.pattern(/^.+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|live\.com)$/)
      ]], 
      matriculefiscale: [null, Validators.required],
      telephone: ['', [Validators.required, Validators.pattern(/^\d{8,}$/)]],
      motdepasse:[
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/),
        ]]    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formData = this.form.value;
    this.authService.registerPrestataire(formData).subscribe({
      next: () => {
        this.snackBar.open('Prestataire ajouté avec succès !', 'Fermer', { duration: 3000 });
        this.router.navigate(['/admin/partenaires']);
      },
      error: () => {
        this.snackBar.open('Email affecter a un autre prestataire ', 'Fermer', { duration: 3000 });
      }
    });
  }
}