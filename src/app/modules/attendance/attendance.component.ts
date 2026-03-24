import { Component, OnInit } from '@angular/core';
import { AttendanceService } from './attendance.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
  standalone: false
})
export class AttendanceComponent implements OnInit {
  records: any[] = [];
  loading = false;
  message: string | null = null;
  location = '';

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {
    this.loadList();
  }

  loadList(): void {
    this.loading = true;
    this.message = null;
    this.attendanceService.getAttendanceList({ page: 1, limit: 50 }).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.records = res.data.records || res.data.attendance || res.data || [];
        }
        this.loading = false;
      },
      error: (e) => {
        this.message = e?.message || 'Failed to load attendance';
        this.loading = false;
      }
    });
  }

  checkIn(): void {
    this.attendanceService.checkIn(this.location || undefined).subscribe({
      next: (res) => {
        this.message = res.success ? (res.message || 'Checked in') : (res.message || 'Check-in failed');
        this.loadList();
      },
      error: (e) => {
        this.message = e?.message || 'Check-in failed';
      }
    });
  }

  checkOut(): void {
    this.attendanceService.checkOut(this.location || undefined).subscribe({
      next: (res) => {
        this.message = res.success ? (res.message || 'Checked out') : (res.message || 'Check-out failed');
        this.loadList();
      },
      error: (e) => {
        this.message = e?.message || 'Check-out failed';
      }
    });
  }
}
