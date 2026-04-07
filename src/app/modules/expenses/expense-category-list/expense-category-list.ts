import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ExpenseService } from "../expense.service";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: "app-expense-category-list",
  imports: [CommonModule],
  templateUrl: "./expense-category-list.html",
  styleUrl: "./expense-category-list.scss",
})
export class ExpenseCategoryList implements OnInit {
  categories: any[] = [];
  loading: boolean = false;
  errorMessage: string = "";

  constructor(
    private expenseService: ExpenseService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.errorMessage = "";

    this.expenseService.getCategories().subscribe({
      next: (res: any) => {
        // Check the browser console! If this doesn't print, the API call never finished.
        console.log("Data received:", res);

        this.loading = false; // Turn off spinner

        if (res && res.success) {
          this.categories = res.data || [];
          this.cdr.detectChanges();
        } else {
          this.categories = [];
          this.errorMessage = res?.message || "Failed to load categories";
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = "Network Error";
        console.error("API Error:", err);
      },
    });
  }

  // Navigate to create category component
  goToCreateCategory() {
    this.router.navigate(["/expenses/expense-categoryCreate"]);
  }
}
