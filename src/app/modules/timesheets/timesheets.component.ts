import { Component, OnInit } from '@angular/core';
import { TimesheetsService } from './timesheets.service';

@Component({
  selector: 'app-timesheets',
  templateUrl: './timesheets.component.html',
  styleUrls: ['./timesheets.component.scss'],
  standalone: false
})
export class TimesheetsComponent implements OnInit {
  timesheets: any[] = [];
  loading = false;
  page = 1;
  limit = 20;
  total = 0;
  summary: any = {};
  filters = {
    project_id: null,
    start_date: '',
    end_date: '',
    status: ''
  };

  constructor(private timesheetsService: TimesheetsService) {}

  ngOnInit(): void {
    this.loadTimesheets();
  }

  loadTimesheets(): void {
    this.loading = true;
    const params = {
      page: this.page,
      limit: this.limit,
      ...this.filters
    };

    this.timesheetsService.getTimesheets(params).subscribe({
      next: (response) => {
        if (response.success) {
          this.timesheets = response.data.timesheets || [];
          this.summary = response.data.summary || {};
          this.total = response.data.pagination?.total || 0;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading timesheets:', error);
        this.loading = false;
      }
    });
  }

  submitTimesheet(): void {
    // Open timesheet submission modal/form
  }

  onFilterChange(): void {
    this.page = 1;
    this.loadTimesheets();
  }

  onPageChange(page: number): void {
    this.page = page;
    this.loadTimesheets();
  }

  getTotalPages(): number {
    return Math.ceil(this.total / this.limit);
  }

  hasSummary(): boolean {
    return this.summary && Object.keys(this.summary).length > 0;
  }
}

