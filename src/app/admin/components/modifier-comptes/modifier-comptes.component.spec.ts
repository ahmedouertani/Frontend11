import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierComptesComponent } from './modifier-comptes.component';

describe('ModifierComptesComponent', () => {
  let component: ModifierComptesComponent;
  let fixture: ComponentFixture<ModifierComptesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifierComptesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierComptesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
