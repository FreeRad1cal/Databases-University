import { TestBed } from '@angular/core/testing';

import { TokenPersisterService } from './token-persister.service';

describe('TokenPersisterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TokenPersisterService = TestBed.get(TokenPersisterService);
    expect(service).toBeTruthy();
  });
});
