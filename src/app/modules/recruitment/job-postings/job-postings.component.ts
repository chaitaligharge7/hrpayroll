import { Component, OnInit } from '@angular/core';
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
  loading = false;
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
    this.loading = true;
    const params = {
      page: this.page,
      limit: this.limit,
      ...this.filters
    };

    this.jobPostingsService.getJobPostings(params).subscribe({
      next: (response) => {
        if (response.success) {
          this.jobPostings = response.data.job_postings || [];
          this.total = response.data.pagination?.total || 0;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading job postings:', error);
        this.loading = false;
      }
    });
  }

  createJobPosting(): void {
    this.router.navigate(['/recruitment/job-postings/create']);
  }

  viewJobPosting(jobId: number): void {
    this.router.navigate(['/recruitment/job-postings', jobId]);
  }

  editJobPosting(jobId: number): void {
    this.router.navigate(['/recruitment/job-postings', jobId, 'edit']);
  }

  onFilterChange(): void {
    this.page = 1;
    this.loadJobPostings();
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
}

