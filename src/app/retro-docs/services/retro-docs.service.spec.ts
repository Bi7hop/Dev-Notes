import { TestBed } from '@angular/core/testing';

import { RetroDocsService } from './retro-docs.service';

describe('RetroDocsService', () => {
  let service: RetroDocsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RetroDocsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
