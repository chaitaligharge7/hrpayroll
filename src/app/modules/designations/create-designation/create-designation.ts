import { Component } from '@angular/core';
import { DesignationsService } from '../designations.service';
import { ApiService } from '../../../core/services/api.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-designation',
  imports: [FormsModule,CommonModule],
  templateUrl: './create-designation.html',
  styleUrl: './create-designation.scss',
})
export class CreateDesignation {


  
  // ✅ Form model (same pattern as department)
  form: any = {
    designation_name: '',
    designation_code: '',
    department_id: null,
    designation_description: '',
    is_active: 1
  };

  departments: any[] = []; // dropdown data
  loading = false;

  constructor(
    private designationService: DesignationsService,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  // ✅ Load departments for dropdown
  loadDepartments(): void {
    this.api.get('departments/list').subscribe({
      next: (res: any) => {
        if (res.success) {
          this.departments = res.data || [];
        }
      },
      error: () => {
        alert('Failed to load departments');
      }
    });
  }

  // ✅ Submit method (same style as department)
  onSubmit(): void {
    if (!this.form.designation_name || !this.form.designation_code) {
      alert('Name and Code are required');
      return;
    }

    this.loading = true;

    this.designationService.createDesignation(this.form).subscribe({
      next: (res: any) => {
        if (res.success) {
          alert('Designation created successfully');
          this.router.navigate(['/designations']); // redirect
        }
        this.loading = false;
      },
      error: (err) => {
        alert(err?.error?.message || 'Error creating designation');
        this.loading = false;
      }
    });
  }

  // ✅ Cancel button
  cancel(): void {
    this.router.navigate(['/designations']);
  }
}