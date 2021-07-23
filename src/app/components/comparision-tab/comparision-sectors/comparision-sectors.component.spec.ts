import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisionSectorsComponent } from './comparision-sectors.component';

describe('ComparisionSectorsComponent', () => {
  let component: ComparisionSectorsComponent;
  let fixture: ComponentFixture<ComparisionSectorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComparisionSectorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparisionSectorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
