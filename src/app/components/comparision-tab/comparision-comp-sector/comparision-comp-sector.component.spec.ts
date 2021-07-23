import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisionCompSectorComponent } from './comparision-comp-sector.component';

describe('ComparisionCompSectorComponent', () => {
  let component: ComparisionCompSectorComponent;
  let fixture: ComponentFixture<ComparisionCompSectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComparisionCompSectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparisionCompSectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
