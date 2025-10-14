import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OmegaComponent } from './omega.component';

describe('OmegaComponent', () => {
  let component: OmegaComponent;
  let fixture: ComponentFixture<OmegaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OmegaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OmegaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
