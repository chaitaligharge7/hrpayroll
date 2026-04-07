import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenseService } from '../expense.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expense-category-create',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './expense-category-create.html',
  styleUrl: './expense-category-create.scss',
})
export class ExpenseCategoryCreate implements OnInit {

  categoryForm!: FormGroup;
  loading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Initialize form
   */
  initForm() {
    this.categoryForm = this.fb.group({
      category_code: ['', Validators.required],
      category_name: ['', Validators.required],
      category_description: [''],
      is_taxable: [0] // default No
    });
  }

  /**
   * Submit form
   */
  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const payload = this.categoryForm.value;

    this.expenseService.createCategory(payload).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = res.message || 'Category created successfully';
        this.categoryForm.reset({ is_taxable: 0 });
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message || 'Failed to create category';
        console.error(err);
      }
    });
  }

}