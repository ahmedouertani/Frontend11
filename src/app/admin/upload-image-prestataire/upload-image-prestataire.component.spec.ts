import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadImagePrestataireComponent } from './upload-image-prestataire.component';

describe('UploadImagePrestataireComponent', () => {
  let component: UploadImagePrestataireComponent;
  let fixture: ComponentFixture<UploadImagePrestataireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadImagePrestataireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadImagePrestataireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
