import { Component } from '@angular/core';
import { DepartmentsService } from '../departments.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-department',
  imports: [FormsModule,CommonModule],
  templateUrl: './create-department.html',
  styleUrl: './create-department.scss',
})
export class CreateDepartment {// ✅ NEW: form model
  form: any = {
    department_name: '',
    department_code: '',
    department_description: '',
    parent_department_id: null,
    head_employee_id: null,
    cost_center: '',
    is_active: 1
  };

  loading = false;

  constructor(
    private departmentService: DepartmentsService,
    private router: Router
  ) {}

  // ✅ NEW: submit method
  onSubmit(): void {
    if (!this.form.department_name || !this.form.department_code) {
      alert('Name and Code are required');
      return;
    }

    this.loading = true;

    this.departmentService.createDepartment(this.form).subscribe({
      next: (res: any) => {
        if (res.success) {
          alert('Department created successfully');
          this.router.navigate(['/departments']); // redirect to list
        }
        this.loading = false;
      },
      error: (err) => {
        alert(err?.error?.message || 'Error creating department');
        this.loading = false;
      }
    });
  }
}