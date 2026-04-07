import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseCategoryList } from './expense-category-list';

describe('ExpenseCategoryList', () => {
  let component: ExpenseCategoryList;
  let fixture: ComponentFixture<ExpenseCategoryList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseCategoryList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseCategoryList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
