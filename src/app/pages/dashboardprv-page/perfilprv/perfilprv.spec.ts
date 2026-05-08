import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Perfilprv } from './perfilprv';

describe('Perfilprv', () => {
  let component: Perfilprv;
  let fixture: ComponentFixture<Perfilprv>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Perfilprv]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Perfilprv);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
