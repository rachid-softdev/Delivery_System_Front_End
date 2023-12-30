import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundListCreateComponent } from './round-list-create.component';

describe('RoundListCreateComponent', () => {
  let component: RoundListCreateComponent;
  let fixture: ComponentFixture<RoundListCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoundListCreateComponent]
    });
    fixture = TestBed.createComponent(RoundListCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
