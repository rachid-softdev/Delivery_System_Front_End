import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverListDeleteComponent } from './driver-list-delete.component';

describe('DriverListDeleteComponent', () => {
  let component: DriverListDeleteComponent;
  let fixture: ComponentFixture<DriverListDeleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DriverListDeleteComponent]
    });
    fixture = TestBed.createComponent(DriverListDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
