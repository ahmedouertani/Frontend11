import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandEventsComponent } from './command-events.component';

describe('CommandEventsComponent', () => {
  let component: CommandEventsComponent;
  let fixture: ComponentFixture<CommandEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommandEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommandEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
