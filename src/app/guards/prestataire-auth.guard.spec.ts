import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { prestataireAuthGuard } from './prestataire-auth.guard';

describe('prestataireAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => prestataireAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
