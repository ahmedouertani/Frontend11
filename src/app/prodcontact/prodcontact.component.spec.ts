import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdcontactComponent } from './prodcontact.component';

describe('ProdcontactComponent', () => {
  let component: ProdcontactComponent;
  let fixture: ComponentFixture<ProdcontactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProdcontactComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdcontactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
