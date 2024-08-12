import { TestBed } from '@angular/core/testing';

import { ShiftFirestoreService } from './shift-firestore.service';

describe('ShiftFirestoreService', () => {
  let service: ShiftFirestoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShiftFirestoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
