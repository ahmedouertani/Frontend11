import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RendezVousClientComponent } from './rendez-vous-client.component';

describe('RendezVousClientComponent', () => {
  let component: RendezVousClientComponent;
  let fixture: ComponentFixture<RendezVousClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RendezVousClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RendezVousClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
