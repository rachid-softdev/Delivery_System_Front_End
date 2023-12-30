import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverListCreateComponent } from './driver-list-create.component';

describe('DriverListCreateComponent', () => {
  let component: DriverListCreateComponent;
  let fixture: ComponentFixture<DriverListCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DriverListCreateComponent]
    });
    fixture = TestBed.createComponent(DriverListCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
