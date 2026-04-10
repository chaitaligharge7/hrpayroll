import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JobPostingsService } from '../job-postings.service';
import { DepartmentsService } from '../../../departments/departments.service';
import { ApiService } from '../../../../core/services/api.service';


@Component({
  selector: 'app-job-posting-form',
  templateUrl: './job-posting-form.component.html',
  styleUrls: ['./job-posting-form.component.scss'],
  standalone: false
})
export class JobPostingFormComponent implements OnInit {
  form: FormGroup;
  departments: any[] = [];
  designations: any[] = [];
  loadingMaster = false;
  loadingJob = false;

  statuses: string[] = [];
  saving = false;
  message: string | null = null;
  error: string | null = null;
  isEditMode = false;
  private editJobId: number | null = null;
  private skipDepartmentChange = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private jobPostingsService: JobPostingsService,
    private departmentsService: DepartmentsService,
    private api: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      job_code: ['', Validators.required],
      job_title: ['', Validators.required],
      department_id: [null, Validators.required],
      designation_id: [null, Validators.required],
      job_description: [''],
      requirements: [''],
      experience_min: [null],
      experience_max: [null],
      salary_min: [null],
      salary_max: [null],
      location: [''],
      employment_type: [''],
      no_of_positions: [1, [Validators.required, Validators.min(1)]],
      closing_date: [''],
      status: ['Draft']
    });
  }

ngOnInit(): void {
  const jobId = this.route.snapshot.paramMap.get('jobId');
  if (jobId) {
    this.isEditMode = true;
    this.editJobId = +jobId;
  }

  this.loadStatuses();
  this.loadAllDesignations();

  this.form.get('department_id')?.valueChanges.subscribe((deptId) => {
    if (this.skipDepartmentChange) return;
    this.form.patchValue({ designation_id: null });
    if (deptId) {
      this.loadDesignations(deptId);
    } else {
      this.loadAllDesignations();
    }
  });

  this.loadDepartments();
}
loadStatuses(): void {
  this.api.get<any>('recruitment/job-postings/statuses').subscribe({
    next: (res) => {
      if (res.success && res.data) {
        this.statuses = res.data;
            this.cdr.detectChanges(); // 👈 force update

      }
    },
    error: () => {
      this.statuses = [];
    }
  });
}
  loadDepartments(): void {
    this.loadingMaster = true;
    this.departmentsService.getDepartments().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.departments = res.data.departments ?? (Array.isArray(res.data) ? res.data : []);
          this.cdr.detectChanges();
        }
        this.loadingMaster = false;
        if (this.isEditMode && this.editJobId) {
          this.loadJobForEdit(this.editJobId);
        }
      },
      error: () => {
        this.loadingMaster = false;
        this.error = 'Could not load departments';
      }
    });
  }

  loadJobForEdit(id: number): void {
    this.loadingJob = true;
    this.error = null;
    this.jobPostingsService.getJobPosting(id).subscribe({
      next: (res) => {
        this.loadingJob = false;
        if (!res.success || !res.data) {
          this.error = res.message || 'Job not found';
          return;
        }
        const j = res.data;
        const closing =
          j.closing_date && String(j.closing_date).length >= 10 ? String(j.closing_date).slice(0, 10) : '';
        this.skipDepartmentChange = true;
        this.form.patchValue(
          {
            job_code: j.job_code || '',
            job_title: j.job_title || '',
            department_id: j.department_id ?? null,
            designation_id: null,
            job_description: j.job_description || '',
            requirements: j.requirements || '',
            experience_min: j.experience_min ?? null,
            experience_max: j.experience_max ?? null,
            salary_min: j.salary_min ?? null,
            salary_max: j.salary_max ?? null,
            location: j.location || '',
            employment_type: j.employment_type || '',
            no_of_positions: j.no_of_positions ?? 1,
            closing_date: closing,
            status: j.status || 'Draft'
          },
          { emitEvent: false }
        );
        const deptId = j.department_id;
        if (deptId) {
          this.loadDesignations(deptId, j.designation_id ?? null);
        } else {
          this.skipDepartmentChange = false;
        }
      },
      error: (e) => {
        this.loadingJob = false;
        this.error = e?.message || 'Could not load job';
      }
    });
  }

  loadAllDesignations(): void {
    this.api.get<any>('designations/list').subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.designations = res.data.designations ?? (Array.isArray(res.data) ? res.data : []);
          this.cdr.detectChanges();
        }
      },
      error: () => { this.designations = []; }
    });
  }

  loadDesignations(departmentId: number, selectDesignationId?: number | null): void {
    this.api.get<any[]>('designations/list', { department_id: departmentId }).subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.designations = res.data.designations ?? (Array.isArray(res.data) ? res.data : []);
          this.cdr.detectChanges();
        }
        if (selectDesignationId != null) {
          this.form.patchValue({ designation_id: selectDesignationId }, { emitEvent: false });
        }
        this.skipDepartmentChange = false;
      },
      error: () => {
        this.designations = [];
        this.skipDepartmentChange = false;
      }
    });
  }

  submit(): void {
    this.message = null;
    this.error = null;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const payload: Record<string, unknown> = {
      job_code: raw.job_code?.trim(),
      job_title: raw.job_title?.trim(),
      department_id: +raw.department_id,
      designation_id: +raw.designation_id,
      no_of_positions: +raw.no_of_positions,
      status: raw.status || 'Draft'
    };
    const optional = [
      'job_description',
      'requirements',
      'experience_min',
      'experience_max',
      'salary_min',
      'salary_max',
      'location',
      'employment_type',
      'closing_date'
    ] as const;
    optional.forEach((k) => {
      const v = raw[k];
      if (v !== null && v !== undefined && v !== '') {
        payload[k] = typeof v === 'string' ? v.trim() : v;
      }
    });
    this.saving = true;
    const done = {
      next: (res: any) => {
        this.saving = false;
        if (res.success) {
          if (this.isEditMode && this.editJobId) {
            this.message = 'Job posting updated successfully.';
            this.error = null;
            // Navigate back to job postings list after 1.5 seconds to show success message
            setTimeout(() => {
              this.router.navigate(['/recruitment/job-postings']);
            }, 1500);
          } else {
            this.router.navigate(['/recruitment/job-postings']);
          }
        } else {
          this.error = res.message || 'Save failed';
          this.message = null;
        }
      },
      error: (e: any) => {
        this.saving = false;
        this.error = e?.message || 'Save failed';
        this.message = null;
      }
    };
    if (this.isEditMode && this.editJobId) {
      this.jobPostingsService.updateJobPosting(this.editJobId, payload).subscribe(done);

    } else {
      this.jobPostingsService.createJobPosting(payload).subscribe(done);
    }
  }

  cancel(): void {
             this.router.navigate(['/recruitment/job-postings']);

  }
}
