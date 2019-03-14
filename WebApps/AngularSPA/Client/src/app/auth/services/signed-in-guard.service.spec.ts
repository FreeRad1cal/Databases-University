import { TestBed } from '@angular/core/testing';

import { SignedInGuardService } from './signed-in-guard.service';

describe('SignedInGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SignedInGuardService = TestBed.get(SignedInGuardService);
    expect(service).toBeTruthy();
  });
});
