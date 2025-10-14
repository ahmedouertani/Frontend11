import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreenlandComponent } from './greenland.component';

describe('GreenlandComponent', () => {
  let component: GreenlandComponent;
  let fixture: ComponentFixture<GreenlandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GreenlandComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GreenlandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
