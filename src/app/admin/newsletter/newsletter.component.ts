import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-newsletter',
  standalone: false,
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.css']
})
export class NewsletterComponent implements OnInit {
  emails: any[] = [];
  selectedEmails: string[] = [];
  form!: FormGroup;
  isLoading = false;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      subject: ['', Validators.required],
      content: ['', Validators.required]
    });

    this.loadEmails();
  }

  loadEmails() {
    this.auth.getAllEmails().subscribe(data => {
      console.log('Emails reçus:', data);
      this.emails = data;
    });
  }

  toggleEmail(email: string, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const checked = inputElement.checked;

    if (checked) {
      if (!this.selectedEmails.includes(email)) {
        this.selectedEmails.push(email);
      }
    } else {
      this.selectedEmails = this.selectedEmails.filter(e => e !== email);
    }
  }
  sendNewsletter() {
    if (this.form.invalid) {
      this.snackbar.open('Veuillez remplir tous les champs requis', 'Fermer', { duration: 3000 });
      return;
    }
  
    if (this.selectedEmails.length === 0) {
      this.snackbar.open('Veuillez sélectionner au moins un destinataire', 'Fermer', { duration: 3000 });
      return;
    }
  
    this.isLoading = true;
  
    const payload = {
      emails: this.selectedEmails,
      subject: this.form.value.subject,
      content: this.form.value.content
    };
  
    this.auth.sendNewsletter(payload).subscribe({
      next: (response: any) => {
        console.log('Réponse backend:', response);
        this.snackbar.open(response, 'Fermer', { duration: 5000 });
        this.form.reset();
        this.selectedEmails = [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur envoi newsletter:', err);
        this.snackbar.open('Erreur réseau ou serveur', 'Fermer', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }
  
  
}
