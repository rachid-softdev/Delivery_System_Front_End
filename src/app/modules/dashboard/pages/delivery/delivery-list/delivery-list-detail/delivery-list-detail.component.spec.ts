import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryListDetailComponent } from './delivery-list-detail.component';

describe('DeliveryListDetailComponent', () => {
  let component: DeliveryListDetailComponent;
  let fixture: ComponentFixture<DeliveryListDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeliveryListDetailComponent]
    });
    fixture = TestBed.createComponent(DeliveryListDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
