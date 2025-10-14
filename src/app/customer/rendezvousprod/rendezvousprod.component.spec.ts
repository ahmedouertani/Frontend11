import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RendezvousprodComponent } from './rendezvousprod.component';

describe('RendezvousprodComponent', () => {
  let component: RendezvousprodComponent;
  let fixture: ComponentFixture<RendezvousprodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RendezvousprodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RendezvousprodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
