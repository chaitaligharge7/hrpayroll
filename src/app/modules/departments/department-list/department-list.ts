import { Component, OnInit } from "@angular/core";
import { DepartmentsService } from "../departments.service";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-department-list",
  imports: [FormsModule, CommonModule],
  templateUrl: "./department-list.html",
  styleUrl: "./department-list.scss",
})
export class DepartmentListComponent implements OnInit {
  departments: any[] = []; // using any as requested

  loading = false;
  searchTerm = "";

  pagination = {
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0,
  };

  constructor(
    private departmentService: DepartmentsService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.loading = true;

    // ✅ CHANGED: Pass params (search + pagination)
    const params = {
      search: this.searchTerm,
      page: this.pagination.page,
      limit: this.pagination.limit,
    };

    this.departmentService.getDepartments(params).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.departments = res.data || [];

          // ✅ CHANGED: handle pagination response
          this.pagination.total = res.total || 0;
          this.pagination.total_pages = res.total_pages || 0;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  // ✅ CHANGED: Reset page when searching
  onSearch(): void {
    this.pagination.page = 1;
    this.loadDepartments();
  }

  onPageChange(page: number): void {
    this.pagination.page = page;
    this.loadDepartments();
  }

  viewDepartment(dept: any): void {
    this.router.navigate(["/departments", dept.department_id]);
  }

  editDepartment(dept: any): void {
    this.router.navigate(["/departments", dept.department_id, "edit"]);
  }

  createDepartment(): void {
    this.router.navigate(["/departments/create"]);
  }

  // ✅ CHANGED: Fixed crash (removed throw error)
  goToEmployees(): void {
    this.router.navigate(["/employees"]);
  }
  goToDesignations() {
    this.router.navigate(["/designations"]);
  }
}
