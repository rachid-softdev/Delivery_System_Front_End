import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryListCreateComponent } from './delivery-list-create.component';

describe('DeliveryListCreateComponent', () => {
  let component: DeliveryListCreateComponent;
  let fixture: ComponentFixture<DeliveryListCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeliveryListCreateComponent]
    });
    fixture = TestBed.createComponent(DeliveryListCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
