import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { JobPostingsService } from "./job-postings.service";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-job-postings",
  templateUrl: "./job-postings.component.html",
  styleUrls: ["./job-postings.component.scss"],
  standalone: false,
})
export class JobPostingsComponent implements OnInit {
  jobPostings: any[] = [];
  isLoading = false;
  isInitialLoad = true;
  page = 1;
  limit = 20;
  total = 0;

  filters = {
    status: "",
    department_id: null,
  };

  constructor(
    private jobPostingsService: JobPostingsService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Load initial data without showing loading indicator
    this.loadJobPostings(true);

    // ✅ Auto refresh when navigating back
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadJobPostings(true);
      });
  }

  loadJobPostings(isInitial = false): void {
    // Only show loading if it's not the initial load
    if (!isInitial) {
      this.isLoading = true;
    }

    const params: any = {
      page: this.page,
      limit: this.limit,
    };

    if (this.filters.status) {
      params.status = this.filters.status;
    }
    if (this.filters.department_id) {
      params.department_id = this.filters.department_id;
    }

    console.log("Loading job postings with params:", params);

    this.jobPostingsService.getJobPostings(params).subscribe({
      next: (response) => {
        console.log("API Response:", response);
        if (response.success && response.data) {
          const result = response.data.job_postings || [];
          this.jobPostings = result;
          this.total = response.data.pagination?.total ?? result.length;
        } else {
          this.jobPostings = [];
          this.total = 0;
        }
        this.isLoading = false;
        this.isInitialLoad = false;
      },
      error: (error) => {
        console.error("Error loading job postings:", error);
        this.jobPostings = [];
        this.total = 0;
        this.isLoading = false;
      },
    });
  }

  createJobPosting(): void {
    this.router.navigate(["/recruitment/job-postings/create"]);
  }

  viewJobPosting(jobId: number, job?: any): void {
    this.router.navigate(["/recruitment/job-postings", jobId], {
      state: { job },
    });
  }

  editJobPosting(jobId: number): void {
    this.router.navigate(["/recruitment/job-postings", jobId, "edit"]);
  }

  updateJob(job: any): void {
    const updatedData = {
      job_title: job.job_title + " (Updated)",
    };

    this.jobPostingsService
      .updateJobPosting(job.job_id, updatedData)
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            alert("Job updated successfully");
            this.loadJobPostings(false);
          } else {
            alert(res.message || "Update failed");
          }
        },
        error: (err) => {
          console.error("Update error:", err);
          alert("Something went wrong while updating");
        },
      });
  }

  onFilterChange(): void {
    console.log("onFilterChange called, current status:", this.filters.status);
    this.page = 1; // Reset to first page when filter changes
    this.loadJobPostings(false);
  }

  onPageChange(page: number): void {
    this.page = page;
    this.loadJobPostings(false);
  }

  getTotalPages(): number {
    return Math.ceil(this.total / this.limit);
  }

  getMath(): typeof Math {
    return Math;
  }

  deleteJob(jobId: number): void {
    if (!confirm("Are you sure you want to delete this job posting?")) {
      return;
    }

    this.jobPostingsService.deleteJobPosting(jobId).subscribe({
      next: (response: any) => {
        if (response?.success) {
          alert(response.message || "Job deleted successfully");
          this.loadJobPostings(false);
        } else {
          alert(response?.message || "Delete failed");
        }
      },
      error: (error) => {
        console.error("Delete API error:", error);

        if (error?.error?.message) {
          alert(error.error.message);
        } else {
          alert("Something went wrong while deleting");
        }
      },
    });
  }
}
