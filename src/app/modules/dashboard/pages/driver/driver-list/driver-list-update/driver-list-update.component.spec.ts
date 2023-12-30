import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverListUpdateComponent } from './driver-list-update.component';

describe('DriverListUpdateComponent', () => {
  let component: DriverListUpdateComponent;
  let fixture: ComponentFixture<DriverListUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DriverListUpdateComponent]
    });
    fixture = TestBed.createComponent(DriverListUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
