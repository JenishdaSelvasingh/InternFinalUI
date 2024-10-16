import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqManageComponent } from './req-manage.component';

describe('ReqManageComponent', () => {
  let component: ReqManageComponent;
  let fixture: ComponentFixture<ReqManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReqManageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReqManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
