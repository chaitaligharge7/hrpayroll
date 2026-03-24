import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobPostingsService } from '../job-postings.service';

@Component({
  selector: 'app-job-posting-detail',
  templateUrl: './job-posting-detail.component.html',
  styleUrls: ['./job-posting-detail.component.scss'],
  standalone: false
})
export class JobPostingDetailComponent implements OnInit {
  job: any = null;
  loading = false;
  error: string | null = null;
  jobId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobPostingsService: JobPostingsService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('jobId');
      if (!id) {
        this.router.navigate(['/recruitment/job-postings']);
        return;
      }
      this.jobId = +id;
      this.load(this.jobId);
    });
  }

  load(id: number): void {
    this.loading = true;
    this.error = null;
    this.jobPostingsService.getJobPosting(id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.job = res.data;
        } else {
          this.error = res.message || 'Job not found';
        }
        this.loading = false;
      },
      error: (e) => {
        this.error = e?.message || 'Could not load job posting';
        this.loading = false;
      }
    });
  }

  edit(): void {
    if (this.jobId) {
      this.router.navigate(['/recruitment/job-postings', this.jobId, 'edit']);
    }
  }

  back(): void {
    this.router.navigate(['/recruitment/job-postings']);
  }
}
