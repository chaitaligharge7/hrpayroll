import { Component, OnInit } from '@angular/core';
import { AttendanceService } from './attendance.service';
import { ChangeDetectorRef } from '@angular/core';

export interface AttendanceRecord {
  attendance_id: number;
  tenant_id: number;
  employee_id: number;
  attendance_date: string;
  shift_id: number | null;
  check_in_time: string | null;
  check_out_time: string | null;
  attendance_status: string;
  first_name: string;
  last_name: string;
}

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

  constructor(
    private  AttendanceService: AttendanceService,
    private cdr: ChangeDetectorRef
  ) {}
  

  ngOnInit(): void {
    this.loadList();
  }

loadList(): void {
  this.loading = true;
  this.message = null;

  this.AttendanceService.getAttendanceList({ page: 1, limit: 50 }).subscribe({
    next: (res) => {
      if (res.success && res.data) {
        const attendanceRaw = Array.isArray(res.data.attendance) ? res.data.attendance : [];
        this.records = attendanceRaw.map((r: AttendanceRecord) => ({
          ...r,
          status: r.attendance_status || 'Present',
          attendance_date_obj: r.attendance_date ? new Date(r.attendance_date + 'T00:00:00') : null,
          check_in_time_obj: r.check_in_time ? new Date(r.check_in_time) : null,
          check_out_time_obj: r.check_out_time ? new Date(r.check_out_time) : null,
        }));
      } else {
        this.records = [];
      }
      this.loading = false;
      this.cdr.detectChanges();
    },
    error: (e) => {
      this.message = e?.message || 'Failed to load attendance';
      this.records = [];
      this.loading = false;
      this.cdr.detectChanges();
    }
  });
}


  checkIn(): void {
    this.AttendanceService.checkIn(this.location || undefined).subscribe({
      next: (res) => {
        this.message = res.success ? (res.message || 'Checked in') : (res.message || 'Check-in failed');

        if (res.success && res.data?.attendance) {
          const att = res.data.attendance;
          const newRecord = {
            ...att,
            status: att.attendance_status || 'Present',
            attendance_date_obj: att.attendance_date ? new Date(att.attendance_date) : null,
            check_in_time_obj: att.check_in_time ? new Date(att.check_in_time) : null,
            check_out_time_obj: att.check_out_time ? new Date(att.check_out_time) : null,
          };
          this.records = [newRecord, ...this.records];
        }
      },
      error: (e) => {
        this.message = e?.message || 'Check-in failed';
      }
    });
  }

  checkOut(): void {
  this.AttendanceService.checkOut(this.location || undefined).subscribe({
    next: (res) => {
      this.message = res.success ? (res.message || 'Checked out') : (res.message || 'Check-out failed');

      if (res.success && res.data?.attendance) {
        const att = res.data.attendance as AttendanceRecord;
        const index = this.records.findIndex(r => r.attendance_id === att.attendance_id);

        if (index !== -1) {
          const updatedRecord = {
            ...att,
            status: att.attendance_status || 'Present',
            attendance_date_obj: att.attendance_date ? new Date(att.attendance_date) : null,
            check_in_time_obj: att.check_in_time ? new Date(att.check_in_time) : null,
            check_out_time_obj: att.check_out_time ? new Date(att.check_out_time) : null,
          };

          // Replace array to trigger Angular change detection
          this.records = [
            ...this.records.slice(0, index),
            updatedRecord,
            ...this.records.slice(index + 1)
          ];
        }
      }
    },
    error: (e) => {
      this.message = e?.message || 'Check-out failed';
    }
  });
}
}

  