import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardprvPage } from './dashboardprv-page';

describe('DashboardprvPage', () => {
  let component: DashboardprvPage;
  let fixture: ComponentFixture<DashboardprvPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardprvPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardprvPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
