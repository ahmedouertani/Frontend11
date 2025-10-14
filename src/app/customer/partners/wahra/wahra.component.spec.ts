import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WahraComponent } from './wahra.component';

describe('WahraComponent', () => {
  let component: WahraComponent;
  let fixture: ComponentFixture<WahraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WahraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WahraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
