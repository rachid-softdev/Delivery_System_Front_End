import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverListHeaderComponent } from './driver-list-header.component';

describe('DriverListHeaderComponent', () => {
  let component: DriverListHeaderComponent;
  let fixture: ComponentFixture<DriverListHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DriverListHeaderComponent]
    });
    fixture = TestBed.createComponent(DriverListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
