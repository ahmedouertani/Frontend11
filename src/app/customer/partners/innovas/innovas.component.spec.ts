import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InnovasComponent } from './innovas.component';

describe('InnovasComponent', () => {
  let component: InnovasComponent;
  let fixture: ComponentFixture<InnovasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InnovasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InnovasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
