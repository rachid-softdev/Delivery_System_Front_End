import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverListDetailComponent } from './driver-list-detail.component';

describe('DriverListDetailComponent', () => {
  let component: DriverListDetailComponent;
  let fixture: ComponentFixture<DriverListDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DriverListDetailComponent]
    });
    fixture = TestBed.createComponent(DriverListDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
