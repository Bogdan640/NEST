import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminResidentsGrid } from './admin-residents-grid';

describe('AdminResidentsGrid', () => {
  let component: AdminResidentsGrid;
  let fixture: ComponentFixture<AdminResidentsGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminResidentsGrid],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminResidentsGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
