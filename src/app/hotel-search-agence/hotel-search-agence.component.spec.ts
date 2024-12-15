import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelSearchAgenceComponent } from './hotel-search-agence.component';

describe('HotelSearchAgenceComponent', () => {
  let component: HotelSearchAgenceComponent;
  let fixture: ComponentFixture<HotelSearchAgenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HotelSearchAgenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelSearchAgenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
