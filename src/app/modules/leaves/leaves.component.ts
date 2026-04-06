import { Component, OnInit } from '@angular/core';
import { LeaveService } from './leave.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.scss'],
  standalone: false
})
export class LeavesComponent implements OnInit {
  requests: any[] = [];
  types: any[] = [];
  loading = false;
  message: string | null = null;
loadingTypes = false;

  form = {
    leave_type_id: null as number | null,
    start_date: '',
    end_date: '',
    reason: ''
  };

  constructor(
  private leaveService: LeaveService,
  private cdr: ChangeDetectorRef
) {}

  ngOnInit(): void {
    this.loadTypes();
    this.loadRequests();
  }


 loadTypes(): void {
  this.loadingTypes = true;

  this.leaveService.getLeaveTypes().subscribe({
    next: (res: any) => {

      if (res?.data) {
        this.types = Array.isArray(res.data)
          ? res.data
          : res.data.types || [];
      } else if (Array.isArray(res)) {
        this.types = res;
      } else if (res?.types) {
        this.types = res.types;
      } else {
        this.types = [];
      }

      this.loadingTypes = false;

      this.cdr.detectChanges(); 
    },
    error: () => {
      this.loadingTypes = false;
      this.cdr.detectChanges();
    }
  });
}

loadRequests(): void {
  this.loading = true;
  this.leaveService.getLeaveRequests({ page: 1, limit: 50 }).subscribe({
    next: (res: any) => {
      console.log('Leave requests API response:', res); // <-- for debugging
      if (res.success && res.data) {
        // Use fallback in case fields are missing
        this.requests = (res.data.leave_requests || []).map((r: any) => ({
          start_date: r.start_date || '—',
          end_date: r.end_date || '—',
          total_days: r.total_days ?? r.days ?? '—',
          status: r.status || '—',
          leave_type_name: r.leave_type_name || '—'
        }));
      } else {
        this.requests = [];
      }
      this.loading = false;
      this.cdr.detectChanges(); // ensure Angular updates the table
    },
    error: (e) => {
      this.message = e?.message || 'Failed to load leave requests';
      this.requests = [];
      this.loading = false;
      this.cdr.detectChanges();
    }
  });
}

  apply(): void {
  if (!this.form.leave_type_id || !this.form.start_date || !this.form.end_date) {
    this.message = 'Leave type, start date and end date are required.';
    return;
  }
  this.leaveService.applyLeave({
    leave_type_id: this.form.leave_type_id,
    start_date: this.form.start_date,
    end_date: this.form.end_date,
    reason: this.form.reason
  }).subscribe({
    next: (res) => {
      this.message = res.success ? (res.message || 'Leave applied') : (res.message || 'Request failed');
      if (res.success) {
        // Delay 500ms to let backend commit
        setTimeout(() => this.loadRequests(), 500);
      }
    },
    error: (e) => {
      this.message = e?.message || 'Request failed';
    }
  });
}
}
