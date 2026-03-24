import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
  standalone: false
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  loading = false;
  isEditMode = false;
  employeeId: number | null = null;
  
  departments: any[] = [];
  designations: any[] = [];
  shifts: any[] = [];
  managers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.employeeForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadMasterData();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.employeeId = +params['id'];
        this.isEditMode = true;
        this.loadEmployee();
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      employee_code: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      middle_name: [''],
      last_name: ['', [Validators.required]],
      date_of_joining: ['', [Validators.required]],
      department_id: ['', [Validators.required]],
      designation_id: ['', [Validators.required]],
      reporting_manager_id: [''],
      work_shift_id: [''],
      employee_type: ['Permanent'],
      basic_salary: [''],
      hra: [''],
      transport_allowance: [''],
      medical_allowance: [''],
      personal_email: ['', [Validators.email]],
      official_email: ['', [Validators.email]],
      personal_phone: [''],
      official_phone: [''],
      pan_number: [''],
      aadhaar_number: [''],
      bank_name: [''],
      bank_account_number: [''],
      bank_ifsc_code: [''],
    });
  }

  loadMasterData(): void {
    // Load departments
    this.api.get('departments/list').subscribe({
      next: (response: any) => {
        if (response.success) {
          this.departments = Array.isArray(response.data) ? response.data : [];
        }
      }
    });

    // Load designations
    this.api.get('designations/list').subscribe({
      next: (response: any) => {
        if (response.success) {
          this.designations = Array.isArray(response.data) ? response.data : [];
        }
      }
    });

    // Load shifts
    this.api.get('shifts/list').subscribe({
      next: (response: any) => {
        if (response.success) {
          this.shifts = Array.isArray(response.data) ? response.data : [];
        }
      }
    });

    // Load managers (employees)
    this.api.get('employees/list', { limit: 1000 }).subscribe({
      next: (response: any) => {
        if (response.success && response.data && Array.isArray(response.data.employees)) {
          this.managers = response.data.employees;
        } else if (response.success && Array.isArray(response.data)) {
          this.managers = response.data;
        } else {
          this.managers = [];
        }
      }
    });
  }

  loadEmployee(): void {
    if (!this.employeeId) return;

    this.loading = true;
    this.employeeService.getEmployee(this.employeeId).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          const employee: any = response.data;
          this.employeeForm.patchValue({
            employee_code: employee.employee_code,
            first_name: employee.first_name,
            middle_name: employee.middle_name,
            last_name: employee.last_name,
            date_of_joining: employee.date_of_joining,
            department_id: employee.department_id,
            designation_id: employee.designation_id,
            reporting_manager_id: employee.reporting_manager_id || null,
            work_shift_id: employee.work_shift_id || null,
            employee_type: employee.employee_type || 'Permanent',
            basic_salary: employee.basic_salary,
            hra: employee.hra || null,
            transport_allowance: employee.transport_allowance || null,
            medical_allowance: employee.medical_allowance || null,
            personal_email: employee.personal_email || '',
            official_email: employee.official_email,
            personal_phone: employee.personal_phone || '',
            official_phone: employee.official_phone || '',
            pan_number: employee.pan_number || '',
            aadhaar_number: employee.aadhaar_number || '',
            bank_name: employee.bank_name || '',
            bank_account_number: employee.bank_account_number || '',
            bank_ifsc_code: employee.bank_ifsc_code || '',
          });
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      return;
    }

    this.loading = true;
    const formData = this.employeeForm.value;

    if (this.isEditMode && this.employeeId) {
      this.employeeService.updateEmployee(this.employeeId, formData).subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/employees']);
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    } else {
      this.employeeService.createEmployee(formData).subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/employees']);
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }

  onDepartmentChange(): void {
    const departmentId = this.employeeForm.get('department_id')?.value;
    if (departmentId) {
      this.api.get('designations/list', { department_id: departmentId }).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.designations = Array.isArray(response.data) ? response.data : [];
          }
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/employees']);
  }
}

