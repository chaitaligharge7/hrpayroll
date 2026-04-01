import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { JobPostingsService } from './job-postings.service';

@Component({
  selector: 'app-job-postings',
  templateUrl: './job-postings.component.html',
  styleUrls: ['./job-postings.component.scss'],
  standalone: false
})
export class JobPostingsComponent implements OnInit {
  jobPostings: any[] = [];
  isLoading = false;
  page = 1;
  limit = 20;
  total = 0;
  filters = {
    status: '',
    department_id: null
  };

  constructor(
    private jobPostingsService: JobPostingsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadJobPostings();
  }

  loadJobPostings(): void {
    const params = {
      page: this.page,
      limit: this.limit,
      status: this.filters.status || undefined,
      department_id: this.filters.department_id || undefined
    };

    this.jobPostingsService.getJobPostings(params).subscribe({
      next: (response) => {
        if (response.success) {
          let result = response.data.job_postings || [];

          // Ensure dropdown filtering works client-side if backend is inconsistent
          if (this.filters.status) {
            result = result.filter((job: any) => job.status === this.filters.status);
          }
          if (this.filters.department_id) {
            result = result.filter((job: any) => job.department_id === this.filters.department_id);
          }

          if (!this.filters.status && result.length === 0) {
            this.loadAllStatuses();
            return;
          }

          this.jobPostings = result;
          this.total = (response.data.pagination?.total ?? result.length);
        } else {
          this.jobPostings = [];
          this.total = 0;
        }
      },
      error: (error) => {
        console.error('Error loading job postings:', error);
        this.jobPostings = [];
        this.total = 0;
        this.isLoading = false;
      }
    });
  }

  createJobPosting(): void {
    this.router.navigate(['/recruitment/job-postings/create']);
  }

  viewJobPosting(jobId: number, job?: any): void {
    this.router.navigate(['/recruitment/job-postings', jobId], { state: { job } });
  }

  editJobPosting(jobId: number): void {
    this.router.navigate(['/recruitment/job-postings', jobId, 'edit']);
  }

  onStatusChange(status: string): void {
    this.filters.status = status;
    this.page = 1;
    this.loadJobPostings();
  }

  onFilterChange(): void {
    this.page = 1;
    this.loadJobPostings();
  }

  loadAllStatuses(): void {
    const statuses = ['Draft', 'Published', 'Closed'];
    const baseParams = {
      page: 1,
      limit: 1000,
      department_id: this.filters.department_id || undefined
    };

    forkJoin(statuses.map((status) => this.jobPostingsService.getJobPostings({
      ...baseParams,
      status
    }))).subscribe({
      next: (responses) => {
        const merged: any[] = [];
        responses.forEach((resp) => {
          if (resp.success && Array.isArray(resp.data.job_postings)) {
            merged.push(...resp.data.job_postings);
          }
        });

        this.jobPostings = merged;
        this.total = merged.length;
      },
      error: () => {
        this.jobPostings = [];
        this.total = 0;
      }
    });
  }

  onPageChange(page: number): void {
    this.page = page;
    this.loadJobPostings();
  }

  getTotalPages(): number {
    return Math.ceil(this.total / this.limit);
  }

  getMath(): typeof Math {
    return Math;
  }

  deleteJob(jobId: number): void {
  if (!confirm('Are you sure you want to delete this job posting?')) {
    return;
  }

  this.jobPostingsService.deleteJobPosting(jobId).subscribe({
    next: (response: any) => {
      if (response?.success) {
        alert(response.message || 'Job deleted successfully');

        // Navigate back to job list
        this.router.navigate(['/recruitment/job-postings']);
      } else {
        alert(response?.message || 'Delete failed');
      }
    },
    error: (error) => {
      console.error('Delete API error:', error);

      if (error?.error?.message) {
        alert(error.error.message);
      } else {
        alert('Something went wrong while deleting');
      }
    }
  });
}
}

