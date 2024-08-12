import { TestBed } from '@angular/core/testing';

import { UserServiceFirestoreServiceService } from './user-service-firestore-service.service';

describe('UserServiceFirestoreServiceService', () => {
  let service: UserServiceFirestoreServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserServiceFirestoreServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
