import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthprvPage } from './authprv-page';

describe('AuthprvPage', () => {
  let component: AuthprvPage;
  let fixture: ComponentFixture<AuthprvPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthprvPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthprvPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
