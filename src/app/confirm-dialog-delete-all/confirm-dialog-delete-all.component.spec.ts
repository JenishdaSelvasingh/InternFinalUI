import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogDeleteAllComponent } from './confirm-dialog-delete-all.component';

describe('ConfirmDialogDeleteAllComponent', () => {
  let component: ConfirmDialogDeleteAllComponent;
  let fixture: ComponentFixture<ConfirmDialogDeleteAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmDialogDeleteAllComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogDeleteAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
