import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundListComponent } from './round-list.component';

describe('RoundListComponent', () => {
  let component: RoundListComponent;
  let fixture: ComponentFixture<RoundListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoundListComponent],
    });
    fixture = TestBed.createComponent(RoundListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
