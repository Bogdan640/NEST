import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileBorrowedTools } from './profile-borrowed-tools';

describe('ProfileBorrowedTools', () => {
  let component: ProfileBorrowedTools;
  let fixture: ComponentFixture<ProfileBorrowedTools>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileBorrowedTools],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileBorrowedTools);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
