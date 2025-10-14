import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';   
import { CollabService, Collab } from '../services/collab.service';

@Component({
  selector: 'app-collab-detail',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './collab-detail.component.html',
  styleUrls: ['./collab-detail.component.css']
})
export class CollabDetailComponent implements OnInit {
  collab?: Collab;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private collabService: CollabService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.collabService.getById(id).subscribe({
        next: (data) => {
          this.collab = data;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
    }
  }
}
