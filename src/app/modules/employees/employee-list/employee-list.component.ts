import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { EmployeeService } from "../employee.service";
import { DepartmentsService } from "../../departments/departments.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ChangeDetectorRef } from "@angular/core";

@Component({
  selector: "app-employee-list",
  imports: [CommonModule, FormsModule],
  templateUrl: "./employee-list.component.html",
  styleUrls: ["./employee-list.component.scss"],
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  departments: any[] = [];
  loading = false;
  page = 1;
  limit = 20;
  total = 0;
  filters: {
    department_id: number | null;
    designation_id: number | null;
    employment_status: string;
    search: string;
  } = {
    department_id: null,
    designation_id: null,
    employment_status: "",
    search: "",
  };
  searchTerm = "";
  selectedDepartment: number | null = null;
  selectedStatus = "Active";
  pagination = {
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0,
  };

  constructor(
    private employeeService: EmployeeService,
    private departmentsService: DepartmentsService,
    private router: Router,
    private cdr: ChangeDetectorRef, // ✅ ADD THIS
  ) {}

  ngOnInit(): void {
    this.filters.employment_status = this.selectedStatus; // ✅ IMPORTANT
    this.loadEmployees();

    this.loadDepartments();
  }

  loadDepartments(): void {
    this.departmentsService.getDepartments().subscribe({
      next: (response) => {
        if (response.success) {
          this.departments = response.data || [];
        }
      },
      error: (error) => {
        console.error("Error loading departments:", error);
      },
    });
  }

  // loadEmployees(): void {
  //   this.loading = true;
  //   const params = {
  //     page: this.page,
  //     limit: this.limit,
  //     ...this.filters,
  //   };
  //   this.employeeService.getEmployees(params).subscribe({
  //     next: (response: any) => {
  //       if (response.success && response.data) {
  //         this.employees = response.data.employees || [];
  //         this.cdr.detectChanges(); // ✅ FORCE UI UPDATE
  //         this.total = response.data.pagination?.total || 0;
  //         this.pagination = {
  //           page: response.data.pagination?.page || this.page,
  //           limit: response.data.pagination?.limit || this.limit,
  //           total: response.data.pagination?.total || 0,
  //           total_pages:
  //             response.data.pagination?.total_pages ||
  //             Math.ceil(this.total / this.limit),
  //         };
  //       }
  //       this.loading = false;
  //     },
  //     error: (error) => {
  //       console.error("Error loading employees:", error);
  //       this.loading = false;
  //     },
  //   });
  // }
  loadEmployees(): void {
    this.loading = true;

    const params: any = {
      page: this.page,
      limit: this.limit,
    };

    if (this.selectedDepartment) {
      params.department_id = this.selectedDepartment;
    }

    if (this.selectedStatus) {
      params.employment_status = this.selectedStatus;
    }

    if (this.searchTerm) {
      params.search = this.searchTerm;
    }

    this.employeeService.getEmployees(params).subscribe({
      next: (response: any) => {
        // ✅ FIX HERE

        if (response.success && response.data) {
          this.employees = response.data.employees || [];
          this.total = response.data.pagination?.total || 0;
          this.pagination = {
            page: response.data.pagination?.page || this.page,
            limit: response.data.pagination?.limit || this.limit,
            total: response.data.pagination?.total || 0,
            total_pages:
              response.data.pagination?.total_pages ||
              Math.ceil(this.total / this.limit),
          };
        }
        this.loading = false;
        this.cdr.detectChanges(); // 🔥 THIS FIXES YOUR ISSUE
      },
      error: (error) => {
        console.error("Error loading employees:", error);
        this.loading = false;
      },
    });
  }
  viewEmployee(employee: any): void {
    this.router.navigate(["/employees", employee.employee_id || employee.id]);
      // this.router.navigate(['/employees',employee.employee_id]);

  }

  editEmployee(employee: any): void {
    this.router.navigate([
      "/employees",
      employee.employee_id || employee.id,
      "edit",
    ]);
  }

  deleteEmployee(employee: any): void {
    if (
      confirm(
        `Are you sure you want to delete employee ${employee.first_name} ${employee.last_name}?`,
      )
    ) {
      this.employeeService
        .deleteEmployee(employee.employee_id || employee.id)
        .subscribe({
          next: (response: any) => {
            if (response.success) {
              this.loadEmployees();
            }
          },
          error: (error) => {
            console.error("Error deleting employee:", error);
          },
        });
    }
  }

  onFilterChange(): void {
    this.page = 1;
    this.loadEmployees();
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.pagination.total_pages) {
      return;
    }
    this.page = page;
    this.pagination.page = page;
    this.loadEmployees();
  }

  onStatusChange(): void {
    this.filters.employment_status = this.selectedStatus;
    this.page = 1;
    this.pagination.page = 1;
    this.loadEmployees();
  }

  getMath(): typeof Math {
    return Math;
  }

  createEmployee(): void {
    this.router.navigate(["/employees/create"]);
  }

  onSearch(): void {
    this.filters.search = this.searchTerm;
    this.page = 1;
    this.loadEmployees();
  }

  onDepartmentChange(): void {
    this.filters.department_id = this.selectedDepartment;
    this.page = 1;
    this.loadEmployees();
  }

  goToDepartments() {
    this.router.navigate(["/departments"]);
  }
  goToDesignations() {
    this.router.navigate(["/designations"]);
  }
}
