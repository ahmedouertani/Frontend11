import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-newsletter',
  standalone: false,
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.css'
})
export class NewsletterComponent {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackbar: MatSnackBar
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.http.post('http://localhost:8081/api/newsletter/invite', this.form.value, { responseType: 'text' })
      .subscribe({
        next: () => {
          this.snackbar.open('✅ Inscription réussie à la newsletter', 'Fermer', { duration: 3000 });
          this.form.reset();
        },
        error: (err) => {
          const msg = err.status === 400 ? err.error : '❌ Erreur d\'inscription';
          this.snackbar.open(msg, 'Fermer', { duration: 4000 });
        }
      });
  }
}