import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseCategoryCreate } from './expense-category-create';

describe('ExpenseCategoryCreate', () => {
  let component: ExpenseCategoryCreate;
  let fixture: ComponentFixture<ExpenseCategoryCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseCategoryCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseCategoryCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
