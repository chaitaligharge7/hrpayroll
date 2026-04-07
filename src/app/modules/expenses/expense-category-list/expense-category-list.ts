import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../expense.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expense-category-list',
  imports: [CommonModule],
  templateUrl: './expense-category-list.html',
  styleUrl: './expense-category-list.scss',
})
export class ExpenseCategoryList implements OnInit {

 
  categories: any[] = [];
  loading: boolean = false;
  errorMessage: string = '';

  constructor(private expenseService: ExpenseService,private router:Router) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.errorMessage = '';

    this.expenseService.getCategories().subscribe({
      next: (res: any) => {
        // Stop loading spinner immediately
        this.loading = false;

        // Check for success and data
        if (res.success) {
          this.categories = res.data || [];
        } else {
          this.categories = [];
          this.errorMessage = res.message || 'Failed to load categories';
        }
      },
      error: (err) => {
        this.loading = false;
        this.categories = [];
        this.errorMessage = err.message || 'Failed to load categories';
        console.error(err);
      }
    });
  }

  // Navigate to create category component
  goToCreateCategory() {
    this.router.navigate(['/expenses/expense-categoryCreate']); 
  }
}