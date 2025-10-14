import { TestBed } from '@angular/core/testing';

import { ReservationEventService } from './reservation-event.service';

describe('ReservationEventService', () => {
  let service: ReservationEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservationEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
