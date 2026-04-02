import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectsService } from '../projects.service';
import { EmployeeService } from '../../employees/employee.service';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss'],
  standalone: false
})
export class ProjectFormComponent implements OnInit {
  form: FormGroup;
  managers: any[] = [];
  loadingManagers = false;
  saving = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private projectsService: ProjectsService,
    private employeeService: EmployeeService,
    private router: Router
  ) {
    this.form = this.fb.group({
      project_code: ['', Validators.required],
      project_name: ['', Validators.required],
      project_description: [''],
      client_name: [''],
      project_manager_id: [null as number | null],
      start_date: [''],
      end_date: [''],
      budget: [null as number | null],
      is_billable: [true],
      billing_rate: [null as number | null]
    });
  }

  ngOnInit(): void {
    this.loadingManagers = true;
    this.employeeService.getEmployees({ page: 1, limit: 500, employment_status: 'Active' }).subscribe({
      next: (res) => {
        if (res.success && res.data?.employees) {
          this.managers = res.data.employees;
        }
        this.loadingManagers = false;
      },
      error: () => {
        this.loadingManagers = false;
      }
    });
  }

  submit(): void {
    this.error = null;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const payload: Record<string, unknown> = {
      project_code: raw.project_code?.trim(),
      project_name: raw.project_name?.trim(),
      is_billable: raw.is_billable ? 1 : 0
    };
    const opt = ['project_description', 'client_name', 'start_date', 'end_date', 'billing_rate'] as const;
    opt.forEach((k) => {
      const v = raw[k];
      if (v !== null && v !== undefined && v !== '') {
        payload[k] = typeof v === 'string' ? v.trim() : v;
      }
    });
    if (raw.project_manager_id) {
      payload['project_manager_id'] = +raw.project_manager_id;
    }
    if (raw.budget != null && raw.budget !== '') {
      payload['budget'] = +raw.budget;
    }
    this.saving = true;
    this.projectsService.createProject(payload).subscribe({
      next: (res) => {
        this.saving = false;
        if (res.success) {
          // Show project list immediately after create
          this.router.navigate(['/projects']).then(() => {
            // no-op; navigation trigger in projects component will refresh list
          });
        } else {
          this.error = res.message || 'Could not create project';
        }
      },
      error: (e) => {
        this.saving = false;
        this.error = e?.message || 'Could not create project';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/projects']);
  }
}
