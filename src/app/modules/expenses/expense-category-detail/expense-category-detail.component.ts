import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../expense.service';

@Component({
  selector: 'app-expense-category-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expense-category-detail.component.html',
  styleUrl: './expense-category-detail.component.scss',
})
export class ExpenseCategoryDetailComponent implements OnInit {
  category: any = null;
  loading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private expenseService: ExpenseService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCategory(+id);
    }
  }

  loadCategory(id: number) {
    this.loading = true;
    this.expenseService.getCategoryById(id).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res && res.success) {
          this.category = res.data;
          this.cdr.detectChanges();
        } else {
          this.errorMessage = res?.message || 'Failed to load category';
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Failed to load category';
        console.error(err);
      },
    });
  }

  editCategory() {
    this.router.navigate(['/expenses/expense-category', this.category.category_id, 'edit']);
  }

  back() {
    this.router.navigate(['/expenses/expense-category']);
  }
}
