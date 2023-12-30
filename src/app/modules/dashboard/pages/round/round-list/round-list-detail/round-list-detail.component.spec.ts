import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundListDetailComponent } from './round-list-detail.component';

describe('RoundListDetailComponent', () => {
  let component: RoundListDetailComponent;
  let fixture: ComponentFixture<RoundListDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoundListDetailComponent]
    });
    fixture = TestBed.createComponent(RoundListDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
