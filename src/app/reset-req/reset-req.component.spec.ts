import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetReqComponent } from './reset-req.component';

describe('ResetReqComponent', () => {
  let component: ResetReqComponent;
  let fixture: ComponentFixture<ResetReqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetReqComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
