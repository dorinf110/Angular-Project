import { TestBed } from '@angular/core/testing';

import { UserServiceFirestoreService } from './user-service-firestore.service';

describe('UserServiceFirestoreService', () => {
  let service: UserServiceFirestoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserServiceFirestoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
