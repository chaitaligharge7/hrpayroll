import { Component, OnInit,ChangeDetectorRef  } from '@angular/core';
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

 constructor(
  private timesheetsService: TimesheetsService,
  private cd: ChangeDetectorRef
) {}

  ngOnInit(): void {
    this.loadTimesheets();
  }

  

 loadTimesheets(): void {
  this.loading = true;

  const params: any = {
    page: this.page,
    limit: this.limit
  };

  if (this.filters.project_id) params.project_id = this.filters.project_id;
  if (this.filters.start_date) params.start_date = this.filters.start_date;
  if (this.filters.end_date) params.end_date = this.filters.end_date;
  if (this.filters.status) params.status = this.filters.status;

  this.timesheetsService.getTimesheets(params).subscribe({
    next: (res) => {
      console.log("API DATA:", res);

      this.timesheets = res.data?.timesheets || [];
      this.summary = res.data?.summary || {};
      this.total = res.data?.pagination?.total || 0;
        this.cd.detectChanges();

      this.loading = false;
    },
    error: (err) => {
      console.error(err);
      this.loading = false;
    }
  });
}
 submitTimesheet(): void {
  const payload = {
    timesheet_date: '2026-04-10',
    hours_worked: 8,
    project_id: 1,
    billable_hours: 6,
    description: 'Test'
  };

  this.timesheetsService.submitTimesheet(payload)
    .subscribe({
      next: (res) => {
        console.log('Inserted:', res);
        this.loadTimesheets(); // refresh list
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
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

