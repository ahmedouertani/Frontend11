import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contacts: any[] = [];
  isLoading = true;
  displayedColumns: string[] = ['nom', 'email','sujet','message'];
  showSidebar = false;

  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;}

  ngOnInit(): void {
    this.loadContacts();
  }
  constructor(
    private authService: AuthService,    private adminService: AdminService,

    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) {}
  loadContacts() {
    this.isLoading = true;
    this.adminService.getAllContacts().subscribe({
      next: (data) => {
        this.contacts = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }



 

  
    }
