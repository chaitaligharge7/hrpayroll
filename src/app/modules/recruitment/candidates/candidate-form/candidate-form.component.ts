import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidatesService } from '../candidates.service';
import { JobPostingsService } from '../../job-postings/job-postings.service';

@Component({
  selector: 'app-candidate-form',
  templateUrl: './candidate-form.component.html',
  styleUrls: ['./candidate-form.component.scss'],
  standalone: false
})
export class CandidateFormComponent implements OnInit {
  form: FormGroup;
  jobs: any[] = [];
  loadingJobs = false;
  loadingCandidate = false;
  saving = false;
  error: string | null = null;
  isEditMode = false;
  private editId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private candidatesService: CandidatesService,
    private jobPostingsService: JobPostingsService
  ) {
    this.form = this.fb.group({
      job_id: [null as number | null, Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      current_company: [''],
      total_experience: [''],
      cover_letter: ['']
    });
  }

  ngOnInit(): void {
    const cid = this.route.snapshot.paramMap.get('candidateId');
    if (cid && this.router.url.includes('/edit')) {
      this.isEditMode = true;
      this.editId = +cid;
      this.form.get('job_id')?.clearValidators();
      this.form.get('job_id')?.updateValueAndValidity();
    }

    this.loadingJobs = true;
    this.jobPostingsService
      .getJobPostings({ page: 1, limit: 200, status: 'Published' })
      .subscribe({
        next: (res) => {
          if (res.success && res.data?.job_postings) {
            this.jobs = res.data.job_postings;
          }
          this.loadingJobs = false;
          if (this.isEditMode && this.editId) {
            this.loadCandidate(this.editId);
          }
        },
        error: () => {
          this.loadingJobs = false;
        }
      });
  }

  loadCandidate(id: number): void {
    this.loadingCandidate = true;
    this.candidatesService.getCandidate(id).subscribe({
      next: (res) => {
        this.loadingCandidate = false;
        if (!res.success || !res.data) {
          this.error = res.message || 'Candidate not found';
          return;
        }
        const c = res.data;
        this.form.patchValue({
          job_id: c.job_id,
          first_name: c.first_name,
          last_name: c.last_name,
          email: c.email,
          phone: c.phone || '',
          current_company: c.current_company || '',
          total_experience: c.total_experience || '',
          cover_letter: c.cover_letter || ''
        });
      },
      error: (e) => {
        this.loadingCandidate = false;
        this.error = e?.message || 'Could not load candidate';
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
      first_name: raw.first_name?.trim(),
      last_name: raw.last_name?.trim(),
      email: raw.email?.trim()
    };
    if (!this.isEditMode) {
      payload['job_id'] = +raw.job_id;
    } else if (raw.job_id) {
      payload['job_id'] = +raw.job_id;
    }
    ['phone', 'current_company', 'total_experience', 'cover_letter'].forEach((k) => {
      const v = raw[k as keyof typeof raw];
      if (v !== null && v !== undefined && String(v).trim() !== '') {
        payload[k] = typeof v === 'string' ? v.trim() : v;
      }
    });

    this.saving = true;
    const sub = {
      next: (res: any) => {
        this.saving = false;
        if (res.success) {
          const id = res.data?.candidate_id ?? this.editId;
          if (id) {
            this.router.navigate(['/recruitment/candidates', id]);
          } else {
            this.router.navigate(['/recruitment/candidates']);
          }
        } else {
          this.error = res.message || 'Save failed';
        }
      },
      error: (e: any) => {
        this.saving = false;
        this.error = e?.message || 'Save failed';
      }
    };
    if (this.isEditMode && this.editId) {
      this.candidatesService.updateCandidate(this.editId, payload).subscribe(sub);
    } else {
      this.candidatesService.createCandidate(payload).subscribe(sub);
    }
  }

  cancel(): void {
    if (this.isEditMode && this.editId) {
      this.router.navigate(['/recruitment/candidates', this.editId]);
    } else {
      this.router.navigate(['/recruitment/candidates']);
    }
  }
}
