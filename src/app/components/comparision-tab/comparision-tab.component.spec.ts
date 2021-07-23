import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisionTabComponent } from './comparision-tab.component';

describe('ComparisionTabComponent', () => {
  let component: ComparisionTabComponent;
  let fixture: ComponentFixture<ComparisionTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComparisionTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparisionTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
