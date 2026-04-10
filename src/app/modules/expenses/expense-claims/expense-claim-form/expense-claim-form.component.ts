import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ExpenseClaimsService } from '../expense-claims.service';
import { ProjectsService } from '../../../projects/projects.service';

@Component({
  selector: 'app-expense-claim-form',
  templateUrl: './expense-claim-form.component.html',
  styleUrls: ['./expense-claim-form.component.scss'],
  standalone: false
})
export class ExpenseClaimFormComponent implements OnInit {
  form: FormGroup;
  categories: any[] = [];
  projects: any[] = [];
  loading = false;
  saving = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private expenseClaimsService: ExpenseClaimsService,
    private projectsService: ProjectsService,
    private router: Router
  ) {
    const today = new Date().toISOString().slice(0, 10);
    this.form = this.fb.group({
      expense_type: ['Other'],
      expense_date: [today],
      items: this.fb.array([this.buildItemRow(today)], Validators.required)
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.expenseClaimsService.getCategories().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.categories = res.data.categories ?? res.data.expense_categories ?? (Array.isArray(res.data) ? res.data : []);
        }
      },
      error: () => {}
    });
    this.projectsService.getProjects({}).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.projects = res.data.projects ?? (Array.isArray(res.data) ? res.data : []);
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  buildItemRow(defaultDate: string): FormGroup {
    return this.fb.group({
      expense_date: [defaultDate, Validators.required],
      description: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      expense_category_id: [null as number | null],
      project_id: [null as number | null]
    });
  }

  addItem(): void {
    const d = this.form.get('expense_date')?.value || new Date().toISOString().slice(0, 10);
    this.items.push(this.buildItemRow(d));
  }

  removeItem(i: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(i);
    }
  }

  submit(): void {
    this.error = null;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const expense_items = raw.items.map((row: any, index: number) => {
      const item: Record<string, unknown> = {
        index,
        expense_date: row.expense_date,
        description: row.description?.trim(),
        amount: +row.amount,
        currency: 'INR'
      };
      if (row.expense_category_id) {
        item['expense_category_id'] = +row.expense_category_id;
      }
      if (row.project_id) {
        item['project_id'] = +row.project_id;
      }
      return item;
    });
    const payload = {
      expense_type: raw.expense_type || 'Other',
      expense_date: raw.expense_date,
      expense_items
    };
    this.saving = true;
    this.expenseClaimsService.createExpenseClaim(payload).subscribe({
      next: (res) => {
        this.saving = false;
        if (res.success) {
          this.router.navigate(['/expenses/claims']);
        } else {
          this.error = res.message || 'Could not submit claim';
        }
      },
      error: (e) => {
        this.saving = false;
        this.error = e?.message || 'Could not submit claim';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/expenses/claims']);
  }
}
