import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPendingRequests } from './admin-pending-requests';

describe('AdminPendingRequests', () => {
  let component: AdminPendingRequests;
  let fixture: ComponentFixture<AdminPendingRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPendingRequests],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPendingRequests);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
