import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ExpenseService } from "../expense.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-expense-category-list",
  imports: [CommonModule, FormsModule],
  templateUrl: "./expense-category-list.html",
  styleUrl: "./expense-category-list.scss",
})
export class ExpenseCategoryList implements OnInit {
  categories: any[] = [];
  loading: boolean = false;
  errorMessage: string = "";
  searchTerm: string = "";

  get filteredCategories(): any[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.categories;
    return this.categories.filter(
      (cat) =>
        cat.category_name?.toLowerCase().includes(term) ||
        cat.category_code?.toLowerCase().includes(term)
    );
  }

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
        this.loading = false;
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

  goToCreateCategory() {
    this.router.navigate(["/expenses/expense-categoryCreate"]);
  }

  viewCategory(cat: any) {
    this.router.navigate(["/expenses/expense-category", cat.category_id]);
  }

  editCategory(cat: any) {
    this.router.navigate(["/expenses/expense-category", cat.category_id, "edit"]);
  }

  deleteCategory(cat: any) {
    if (!confirm(`Delete category "${cat.category_name}"? This action cannot be undone.`)) {
      return;
    }
    this.expenseService.deleteCategory(cat.category_id).subscribe({
      next: (res: any) => {
        if (res && res.success) {
          this.loadCategories();
        } else {
          alert(res?.message || "Failed to delete category");
        }
      },
      error: (err) => {
        console.error("Delete error:", err);
        alert("Failed to delete category");
      },
    });
  }
}
