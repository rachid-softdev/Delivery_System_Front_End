import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundListUpdateComponent } from './delivery-list-update.component';

describe('RoundListUpdateComponent', () => {
  let component: RoundListUpdateComponent;
  let fixture: ComponentFixture<RoundListUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoundListUpdateComponent]
    });
    fixture = TestBed.createComponent(RoundListUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
