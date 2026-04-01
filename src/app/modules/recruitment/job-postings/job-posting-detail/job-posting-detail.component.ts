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
  jobId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobPostingsService: JobPostingsService
  ) {}

  ngOnInit(): void {
    const stateJob = window.history.state?.job;
    if (stateJob) {
      this.job = stateJob;
    }

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
    this.jobPostingsService.getJobPosting(id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.job = res.data;
        }
      },
      error: (e) => {
        console.error('Could not load job posting', e);
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
