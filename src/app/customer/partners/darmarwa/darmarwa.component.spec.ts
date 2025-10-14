import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarmarwaComponent } from './darmarwa.component';

describe('DarmarwaComponent', () => {
  let component: DarmarwaComponent;
  let fixture: ComponentFixture<DarmarwaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DarmarwaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DarmarwaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
