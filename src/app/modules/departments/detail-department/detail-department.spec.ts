import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDepartment } from './detail-department';

describe('DetailDepartment', () => {
  let component: DetailDepartment;
  let fixture: ComponentFixture<DetailDepartment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailDepartment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailDepartment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
