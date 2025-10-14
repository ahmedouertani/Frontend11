import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollabDetailComponent } from './collab-detail.component';

describe('CollabDetailComponent', () => {
  let component: CollabDetailComponent;
  let fixture: ComponentFixture<CollabDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CollabDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollabDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
