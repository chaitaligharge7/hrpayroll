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

  statusOptions: Array<{ value: string; label: string }> = [
    { value: "", label: "All Statuses" },
  ];

  constructor(
    private jobPostingsService: JobPostingsService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Initial status list comes from backend to support all possible items (34+ etc.)
    this.loadJobStatusOptions();

    // Load initial data without showing loading indicator
    this.loadJobPostings(true);

    // ✅ Auto refresh when navigating back
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadJobPostings(true);
      });
  }

  loadJobStatusOptions(): void {
    this.jobPostingsService.getJobPostingStatuses().subscribe({
      next: (response) => {
        if (response.success && Array.isArray(response.data)) {
          const rawStatuses = response.data as Array<string | null | undefined>;
          const statuses: string[] = rawStatuses
            .map((s) => (s || "").toString().trim())
            .filter((s): s is string => s !== "");
          const uniqueStatuses: string[] = Array.from(new Set(statuses)).sort(
            (a, b) => a.localeCompare(b),
          );

          this.statusOptions = [
            { value: "", label: "All Statuses" },
            ...uniqueStatuses.map((status) => ({
              value: status,
              label: status,
            })),
          ];
        } else {
          // Fallback to default statuses if API fails
          this.setDefaultStatusOptions();
        }
      },
      error: (err) => {
        console.error("Failed to load status options, using defaults", err);
        this.setDefaultStatusOptions();
      },
    });
  }

  private setDefaultStatusOptions(): void {
    this.statusOptions = [
      { value: "", label: "All Statuses" },
      { value: "Draft", label: "Draft" },
      { value: "Published", label: "Published" },
      { value: "Closed", label: "Closed" },
    ];
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

  onStatusChange(status: string): void {
    if (typeof status !== "string") {
      return;
    }

    const normalizedStatus = status.trim();
    const allowedValues = this.statusOptions.map((o) => o.value);
    if (!allowedValues.includes(normalizedStatus)) {
      console.warn("Ignoring invalid status filter value:", normalizedStatus);
      return;
    }

    if (this.filters.status === normalizedStatus) {
      // avoid duplicate refresh if value didn't change
      return;
    }

    console.log(
      "Status changed to:",
      normalizedStatus,
      "Current filters:",
      this.filters,
    );

    this.filters.status = normalizedStatus;
    this.page = 1;
    this.loadJobPostings(false);
  }

  onFilterChange(): void {
    this.page = 1;
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
