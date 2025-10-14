import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-prodcontact',
  standalone: false,
  templateUrl: './prodcontact.component.html',
  styleUrl: './prodcontact.component.css'
})
export class ProdcontactComponent implements OnInit {
  contactForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [
        Validators.required,
        Validators.pattern(/^.+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|live\.com)$/)
      ]],     sujet: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched(); // pour montrer les erreurs
      return;
    }

    this.isSubmitting = true;

    this.http.post('http://localhost:8081/api/contact', this.contactForm.value)
      .subscribe({
        next: () => {
          this.snackbar.open('✅ Message envoyé avec succès', 'Fermer', { duration: 3000 });
          this.contactForm.reset();
          this.isSubmitting = false;
        },
        error: (err) => {
          this.snackbar.open('❌ Erreur lors de l’envoi', 'Fermer', { duration: 3000 });
          this.isSubmitting = false;
        }
      });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.contactForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}