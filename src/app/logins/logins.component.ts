import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { UserStorageService } from '../services/storage/user-storage.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-logins',
  standalone: false,
  templateUrl: './logins.component.html',
  styleUrls: ['./logins.component.css']
})
export class LoginsComponent {
  loginForm!: FormGroup;
  singupForm!: FormGroup;
  hidePassword = true;
  isSignUpMode = false;
  isInDialog = false;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router,
    @Optional() private dialogRef?: MatDialogRef<LoginsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any
    
  ) {    this.isInDialog = !!dialogRef;
  }
  close(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    } else {
      console.warn('DialogRef is undefined');
    }
  }
  
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.pattern(/^.+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|live\.com)$/)
      ]],      motdepasse: [null, [Validators.required]],
    });

    this.singupForm = this.formBuilder.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      sexe: [null, [Validators.required]],
      adresse: [null, [Validators.required]],
      telephone: ['', [Validators.required, Validators.pattern(/^\d{8,}$/)]],
      email: ['', [
        Validators.required,
        Validators.pattern(/^.+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|live\.com)$/)
      ]],
           motdepasse: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/),
      ],
    ],
    confirmPassword: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/),
      ],
    ],
    });
      { validators: this.passwordMatchValidator } // ✅ add group validator

  }

  toggleForm(signUp: boolean): void {
    this.isSignUpMode = signUp;
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
  onCloseDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close(false);
    }
  }
  passwordMatchValidator(form: FormGroup) {
  const password = form.get('motdepasse')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { mismatch: true };
}
  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const username = this.loginForm.get('email')!.value;
    const motdepasse = this.loginForm.get('motdepasse')!.value;

    this.authService.login(username, motdepasse).subscribe(
      (res) => {
        if (res) {
          if (UserStorageService.isAdminLoggedIn()) {
            this.router.navigateByUrl('admin/prod');
          } else if (UserStorageService.isCustomerLoggedIn()) {
            this.router.navigateByUrl('/home');
          } else if (UserStorageService.isPrestataireLoggedIn()) {
            this.router.navigateByUrl('prestataire/profile');
          }
          if (this.dialogRef) this.dialogRef.close(true);
        } else {
          this.snackBar.open('Identifiants incorrects.', 'Fermer', { duration: 5000 });
        }
      },
      (error) => {
        if (error.status === 403 && error.error?.error?.includes('bloqué')) {
          this.snackBar.open('❌ Compte bloqué. Contactez l\'administration.', 'Fermer', {
            duration: 5000, panelClass: ['error-snackbar']
          });
        } else {
          this.snackBar.open('Erreur d\'authentification.', 'Fermer', {
            duration: 5000, panelClass: ['error-snackbar']
          });
        }
      }
    );
  }

  onRegister(): void {
    if (this.singupForm.invalid) return;

    const motdepasse = this.singupForm.get('motdepasse')?.value;
    const confirmPassword = this.singupForm.get('confirmPassword')?.value;

    if (motdepasse !== confirmPassword) {
      this.snackBar.open('❌ Les mots de passe ne correspondent pas.', 'Fermer', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.authService.register(this.singupForm.value).subscribe(
      (response) => {
        this.snackBar.open('✅ Inscription réussie. Connexion en cours...', 'Fermer', { duration: 3000 });
        
        // Auto-login après inscription
        this.authService.login(
          this.singupForm.get('email')?.value,
          motdepasse
        ).subscribe(
          (loginRes) => {
            if (loginRes) {
              if (UserStorageService.isPrestataireLoggedIn()) {
                this.router.navigateByUrl('prestataire/profile');
              } else if (UserStorageService.isCustomerLoggedIn()) {
                this.router.navigateByUrl('home');
              } else if (UserStorageService.isAdminLoggedIn()) {
                this.router.navigateByUrl('admin/dashboard');
              }
              
              if (this.dialogRef) {
                this.dialogRef.close(true);
              }
            }
          },
          (loginError) => {
            this.snackBar.open('✅ Inscription réussie. Veuillez vous connecter.', 'Fermer', { duration: 5000 });
            this.toggleForm(false);
          }
        );
      },
      (error) => {
        if (error.status === 406 && error.error === 'User already exists') {
          this.snackBar.open('❌ Email déjà utilisé.', 'Fermer', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        } else {
          this.snackBar.open('❌ Erreur lors de l\'inscription: ' + (error.error?.message || ''), 'Fermer', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      }
    );
  }   
    
}