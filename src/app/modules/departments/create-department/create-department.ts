import { Component, OnInit } from '@angular/core';
import { DepartmentsService } from '../departments.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-department',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-department.html',
  styleUrls: ['./create-department.scss'],
})
export class CreateDepartment implements OnInit {
  // ✅ NEW: form model
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
  isEditMode = false;
  departmentId: number | null = null;

  constructor(
    private departmentService: DepartmentsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.departmentId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.departmentId && !isNaN(this.departmentId)) {
      this.isEditMode = true;
      this.loadDepartment();
    }
  }

  loadDepartment(): void {
    if (!this.departmentId) return;
    
    this.loading = true;
    this.departmentService.getDepartment(this.departmentId).subscribe({
      next: (res: any) => {
        if (res && res.success && res.data) {
          this.form = { ...res.data };
        }
        this.loading = false;
      },
      error: (err) => {
        alert('Error loading department');
        this.loading = false;
      }
    });
  }

  // ✅ NEW: submit method
  onSubmit(): void {
    if (!this.form.department_name || !this.form.department_code) {
      alert('Name and Code are required');
      return;
    }

    this.loading = true;

    const operation = this.isEditMode ? 
      this.departmentService.updateDepartment(this.departmentId!, this.form) : 
      this.departmentService.createDepartment(this.form);

    operation.subscribe({
      next: (res: any) => {
        if (res.success) {
          alert(`Department ${this.isEditMode ? 'updated' : 'created'} successfully`);
          this.router.navigate(['/departments']); // redirect to list
        }
        this.loading = false;
      },
      error: (err) => {
        alert(err?.error?.message || `Error ${this.isEditMode ? 'updating' : 'creating'} department`);
        this.loading = false;
      }
    });
  }
}