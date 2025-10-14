import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisposComponent } from './dispos.component';

describe('DisposComponent', () => {
  let component: DisposComponent;
  let fixture: ComponentFixture<DisposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisposComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
