import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundListDeleteComponent } from './round-list-delete.component';

describe('RoundListDeleteComponent', () => {
  let component: RoundListDeleteComponent;
  let fixture: ComponentFixture<RoundListDeleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoundListDeleteComponent]
    });
    fixture = TestBed.createComponent(RoundListDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
