import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventscontactComponent } from './eventscontact.component';

describe('EventscontactComponent', () => {
  let component: EventscontactComponent;
  let fixture: ComponentFixture<EventscontactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventscontactComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventscontactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
