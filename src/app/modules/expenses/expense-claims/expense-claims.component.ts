import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ExpenseClaimsService } from "./expense-claims.service";

@Component({
  selector: "app-expense-claims",
  templateUrl: "./expense-claims.component.html",
  styleUrls: ["./expense-claims.component.scss"],
  standalone: false,
})
export class ExpenseClaimsComponent implements OnInit {
  expenseClaims: any[] = [];
  loading = false;
  page = 1;
  limit = 20;
  total = 0;
  filters = {
    status: "",
    employee_id: null,
  };
  userRole = "";

  constructor(
    private expenseClaimsService: ExpenseClaimsService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // Get user role from auth service
    this.loadExpenseClaims();
  }

  loadExpenseClaims(): void {
    this.loading = true;
    const params = {
      page: this.page,
      limit: this.limit,
      ...this.filters,
    };

    this.expenseClaimsService.getExpenseClaims(params).subscribe({
      next: (response) => {
        if (response.success) {
          this.expenseClaims = response.data.expense_claims || [];
          this.total = response.data.pagination?.total || 0;
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error("Error loading expense claims:", error);
        this.loading = false;
      },
    });
  }

  createExpenseClaim(): void {
    this.router.navigate(["/expenses/claims/create"]);
  }

  viewExpenseClaim(claimId: number): void {
    this.router.navigate(["/expenses/claims", claimId]);
  }

  approveClaim(claimId: number): void {
    this.expenseClaimsService
      .approveExpenseClaim(claimId, { action: "approve" })
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.loadExpenseClaims();
          }
        },
        error: (error) => {
          console.error("Error approving claim:", error);
        },
      });
  }

  rejectClaim(claimId: number): void {
    const reason = prompt("Please enter rejection reason:");
    if (reason) {
      this.expenseClaimsService
        .approveExpenseClaim(claimId, {
          action: "reject",
          rejection_reason: reason,
        })
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.loadExpenseClaims();
            }
          },
          error: (error) => {
            console.error("Error rejecting claim:", error);
          },
        });
    }
  }

  onFilterChange(): void {
    this.page = 1;
    this.loadExpenseClaims();
  }

  onPageChange(page: number): void {
    this.page = page;
    this.loadExpenseClaims();
  }

  getTotalPages(): number {
    return Math.ceil(this.total / this.limit);
  }

  getMath(): typeof Math {
    return Math;
  }
}
