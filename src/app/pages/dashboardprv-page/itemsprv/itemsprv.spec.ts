import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Itemsprv } from './itemsprv';

describe('Itemsprv', () => {
  let component: Itemsprv;
  let fixture: ComponentFixture<Itemsprv>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Itemsprv]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Itemsprv);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
