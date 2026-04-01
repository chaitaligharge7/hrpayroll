import { Component, OnInit } from "@angular/core";
import { DepartmentsService } from "../departments.service";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ChangeDetectorRef } from "@angular/core"; 
@Component({
  selector: "app-department-list",
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: "./department-list.html",
  styleUrls: ["./department-list.scss"],
})
export class DepartmentListComponent implements OnInit {
  departments: any[] = []; // using any as requested
  selectedDeptId!: number;

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
    private cdr: ChangeDetectorRef, 
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.loading = true;

    const params = {
      search: this.searchTerm,
      page: this.pagination.page,
      limit: this.pagination.limit,
    };

    this.departmentService.getDepartments(params).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.departments = res.data || [];

          this.pagination.total = res.total || 0;
          this.pagination.total_pages = res.total_pages || 0;
        }
        this.loading = false;
        this.cdr.detectChanges(); 
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onSearch(): void {
    this.pagination.page = 1;
    this.loadDepartments();
  }

  onPageChange(page: number): void {
    this.pagination.page = page;
    this.loadDepartments();
  }

  viewDepartment(dept: any): void {
    this.router.navigate(["/departments/detail", dept.department_id]);
  }

  editDepartment(dept: any): void {
    this.router.navigate(["/departments", dept.department_id, "edit"]);
  }

  createDepartment(): void {
    this.router.navigate(["/departments/create"]);
  }

  goToEmployees(): void {
    this.router.navigate(["/employees"]);
  }
  goToDesignations() {
    this.router.navigate(["/designations"]);
  }

 deleteEmployee(dept: any): void {
  if (!dept?.department_id) return;

  const confirmDelete = confirm(
    `Are you sure you want to delete department "${dept.department_name}"?`
  );

  if (!confirmDelete) return;

  this.loading = true;

  this.departmentService.deleteDepartment(dept.department_id).subscribe({
    next: (res: any) => {
      if (res?.success) {
        alert('Department deleted successfully');

        this.loadDepartments();
      } else {
        alert(res?.message || 'Delete failed');
      }

      this.loading = false;
    },
    error: (err) => {
      console.error('DELETE ERROR:', err);
      alert(err?.error?.message || 'Error deleting department');
      this.loading = false;
    }
  });
}


goToDesignation(){
  this.router.navigate(['/designations']);
}
}
