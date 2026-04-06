import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
  successMessage: string | null = null;

  isEditMode = false;
  projectId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private projectsService: ProjectsService,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      project_code: ['', Validators.required],
      project_name: ['', Validators.required],
      project_description: [''],
      client_name: [''],
      project_manager_id: [null],
      start_date: [''],
      end_date: [''],
      budget: [null],
      is_billable: [true],
      billing_rate: [null]
    });
  }

  ngOnInit(): void {
    // ✅ Check edit mode
    this.projectId = Number(this.route.snapshot.paramMap.get('projectId'));
    if (this.projectId) {
      this.isEditMode = true;
      this.loadProject();
    }

    // Load managers
    this.loadManagers();
  }

  loadManagers(): void {
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

  // ✅ Load project for edit
  loadProject(): void {
    this.projectsService.getProject(this.projectId!).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const p = res.data;

          this.form.patchValue({
            project_code: p.project_code,
            project_name: p.project_name,
            project_description: p.project_description,
            client_name: p.client_name,
            project_manager_id: p.project_manager_id,
            start_date: p.start_date,
            end_date: p.end_date,
            budget: p.budget,
            is_billable: p.is_billable == 1,
            billing_rate: p.billing_rate
          });
        }
      },
      error: () => {
        this.error = 'Failed to load project';
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

    const optionalFields = [
      'project_description',
      'client_name',
      'start_date',
      'end_date',
      'billing_rate'
    ] as const;

    optionalFields.forEach((k) => {
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

    // ✅ UPDATE MODE
    if (this.isEditMode && this.projectId) {
      this.projectsService.updateProject(this.projectId, payload).subscribe({
        next: (res) => {
          this.saving = false;
          if (res.success) {
            this.successMessage = 'Project updated successfully!';
            this.error = null;
            // Navigate after showing success message
            setTimeout(() => {
              this.router.navigate(['/projects']);
            }, 2000);
          } else {
            this.error = res.message || 'Could not update project';
            this.successMessage = null;
          }
        },
        error: (e) => {
          this.saving = false;
          this.error = e?.message || 'Could not update project';
          this.successMessage = null;
        }
      });
    }
    // ✅ CREATE MODE
    else {
      this.projectsService.createProject(payload).subscribe({
        next: (res) => {
          this.saving = false;
          if (res.success) {
            this.successMessage = 'Project created successfully!';
            this.error = null;
            // Navigate after showing success message
            setTimeout(() => {
              this.router.navigate(['/projects']);
            }, 2000);
          } else {
            this.error = res.message || 'Could not create project';
            this.successMessage = null;
          }
        },
        error: (e) => {
          this.saving = false;
          this.error = e?.message || 'Could not create project';
          this.successMessage = null;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/projects']);
  }
}