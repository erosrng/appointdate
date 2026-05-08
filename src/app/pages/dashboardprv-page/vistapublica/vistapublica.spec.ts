import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vistapublica } from './vistapublica';

describe('Vistapublica', () => {
  let component: Vistapublica;
  let fixture: ComponentFixture<Vistapublica>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vistapublica]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vistapublica);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
