import { Component, OnInit } from '@angular/core';
import { DepartmentsService } from '../departments.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-department-list',
  imports: [FormsModule,CommonModule],
  templateUrl: './department-list.html',
  styleUrl: './department-list.scss',
})
export class DepartmentListComponent  implements OnInit {

  departments: any[] = [];
  loading = false;

  searchTerm = '';

  pagination = {
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0
  };

  constructor(
    private departmentService: DepartmentsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.loading = true;

    this.departmentService.getDepartments().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.departments = res.data || [];
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    // If backend supports search, pass param
    this.loadDepartments();
  }

  onPageChange(page: number): void {
    this.pagination.page = page;
    this.loadDepartments();
  }

  viewDepartment(dept: any): void {
    this.router.navigate(['/departments', dept.department_id]);
  }

  editDepartment(dept: any): void {
    this.router.navigate(['/departments', dept.department_id, 'edit']);
  }

  // deleteDepartment(dept: any): void {
  //   if (confirm(`Delete ${dept.department_name}?`)) {
  //     this.departmentService.deleteDepartment(dept.department_id).subscribe(() => {
  //       this.loadDepartments();
  //     });
  //   }
  

  createDepartment(){
     this.router.navigate(['/departments/create']);
  }

 


 goToEmployees() {
  throw new Error('Function not implemented.');
}
  // goToDesignations(): void {
  //   this.router.navigate(['/designations']);
  // }

  // getMath(): typeof Math {
  //   return Math;
  // }
}