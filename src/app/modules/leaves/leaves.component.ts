import { Component, OnInit } from '@angular/core';
import { LeaveService } from './leave.service';

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

  form = {
    leave_type_id: null as number | null,
    start_date: '',
    end_date: '',
    reason: ''
  };

  constructor(private leaveService: LeaveService) {}

  ngOnInit(): void {
    this.loadTypes();
    this.loadRequests();
  }

  loadTypes(): void {
    this.leaveService.getLeaveTypes().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.types = Array.isArray(res.data) ? res.data : (res.data as any).types || [];
        }
      },
      error: () => {}
    });
  }

  loadRequests(): void {
    this.loading = true;
    this.leaveService.getLeaveRequests({ page: 1, limit: 50 }).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.requests = res.data.requests || res.data.leaves || res.data || [];
        }
        this.loading = false;
      },
      error: (e) => {
        this.message = e?.message || 'Failed to load leave requests';
        this.loading = false;
      }
    });
  }

  apply(): void {
    if (!this.form.leave_type_id || !this.form.start_date || !this.form.end_date) {
      this.message = 'Leave type, start date and end date are required.';
      return;
    }
    this.leaveService
      .applyLeave({
        leave_type_id: this.form.leave_type_id,
        start_date: this.form.start_date,
        end_date: this.form.end_date,
        reason: this.form.reason
      })
      .subscribe({
        next: (res) => {
          this.message = res.success ? (res.message || 'Leave applied') : (res.message || 'Request failed');
          if (res.success) {
            this.loadRequests();
          }
        },
        error: (e) => {
          this.message = e?.message || 'Request failed';
        }
      });
  }
}
