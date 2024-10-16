import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagingserverComponent } from './pagingserver.component';

describe('PagingserverComponent', () => {
  let component: PagingserverComponent;
  let fixture: ComponentFixture<PagingserverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagingserverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagingserverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
