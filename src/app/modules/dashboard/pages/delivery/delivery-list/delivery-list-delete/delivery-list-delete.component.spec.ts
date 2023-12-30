import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryListDeleteComponent } from './delivery-list-delete.component';

describe('DeliveryListDeleteComponent', () => {
  let component: DeliveryListDeleteComponent;
  let fixture: ComponentFixture<DeliveryListDeleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeliveryListDeleteComponent]
    });
    fixture = TestBed.createComponent(DeliveryListDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
