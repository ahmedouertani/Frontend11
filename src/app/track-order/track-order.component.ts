import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-track-order',
  standalone: false,
  templateUrl: './track-order.component.html',
  styleUrl: './track-order.component.css'
})
export class TrackOrderComponent {
  searchOrderForm!: FormGroup;
order:any;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.searchOrderForm = this.fb.group({
      trackingId: [null, [Validators.required]]
    });
  }

  submitForm() {
    this.authService.getOrderByTrackingId(this.searchOrderForm.get('trackingId')?.value)
      .subscribe(res => {
        console.log(res);
        this.order = res
      });


  }
}