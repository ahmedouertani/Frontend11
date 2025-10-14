import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedouceurComponent } from './ledouceur.component';

describe('LedouceurComponent', () => {
  let component: LedouceurComponent;
  let fixture: ComponentFixture<LedouceurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LedouceurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LedouceurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
