import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AttendanceService } from './attendance.service';

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

  // Calendar
  calendarDays: any[] = [];
  currentMonth: Date = new Date();

  constructor(
    private attendanceService: AttendanceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadList();
  }

  loadList(): void {
    this.loading = true;
    this.message = null;

    this.attendanceService.getAttendanceList({ page: 1, limit: 50 }).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const attendanceRaw = Array.isArray(res.data.attendance) ? res.data.attendance : [];
          this.records = attendanceRaw.map((r: AttendanceRecord) => ({
            ...r,
            status: this.mapStatus(r.attendance_status),
            attendance_date_obj: r.attendance_date ? new Date(r.attendance_date + 'T00:00:00') : null,
            check_in_time_obj: r.check_in_time ? new Date(r.check_in_time) : null,
            check_out_time_obj: r.check_out_time ? new Date(r.check_out_time) : null,
          }));
        } else {
          this.records = [];
        }
        this.loading = false;
        this.generateCalendar(this.currentMonth);
        this.cdr.detectChanges();
      },
      error: (e) => {
        this.message = e?.message || 'Failed to load attendance';
        this.records = [];
        this.loading = false;
        this.generateCalendar(this.currentMonth);
        this.cdr.detectChanges();
      }
    });
  }
 mapStatus(status: string): string {
  if (!status) return 'Present';

  const s = status.toLowerCase();

  if (s === 'late') return 'Late';
  if (s === 'half day') return 'Half Day';
  if (s === 'present') return 'Present';
  if (s === 'absent') return 'Absent';
  if (s === 'leave') return 'Leave';
  if (s === 'holiday') return 'Weekly Off'; // optional mapping
  return status;
}
  checkIn(): void {
  this.attendanceService.checkIn(this.location || undefined).subscribe({
    next: (res) => {
      this.message = res.success ? (res.message || 'Checked in') : (res.message || 'Check-in failed');

      if (res.success && res.data?.attendance) {
        const att = res.data.attendance;
        const newRecord = {
          ...att,
          status: this.mapStatus(att.attendance_status),
          attendance_date_obj: att.attendance_date ? new Date(att.attendance_date) : null,
          check_in_time_obj: att.check_in_time ? new Date(att.check_in_time) : null,
          check_out_time_obj: att.check_out_time ? new Date(att.check_out_time) : null,
        };

        // Add the new record at the start
        this.records = [newRecord, ...this.records];

        // Update calendar immediately
        this.generateCalendar(this.currentMonth);
      }
    },
    error: (e) => {
      this.message = e?.message || 'Check-in failed';
    }
  });
}

  checkOut(): void {
  const todayRecord = this.records.find(r => r.attendance_date_obj?.toDateString() === new Date().toDateString());

  if (!todayRecord) {
    this.message = 'Cannot check out before check-in';
    return;
  }

  this.attendanceService.checkOut(this.location || undefined).subscribe({
    next: (res) => {
      this.message = res.success ? (res.message || 'Checked out') : (res.message || 'Check-out failed');

      if (res.success && res.data?.attendance) {
        const att = res.data.attendance as AttendanceRecord;
        const index = this.records.findIndex(r => r.attendance_id === att.attendance_id);
        if (index !== -1) {
          const updatedRecord = {
            ...att,
            status: this.mapStatus(att.attendance_status),
            attendance_date_obj: att.attendance_date ? new Date(att.attendance_date) : null,
            check_in_time_obj: att.check_in_time ? new Date(att.check_in_time) : null,
            check_out_time_obj: att.check_out_time ? new Date(att.check_out_time) : null,
          };

          this.records[index] = updatedRecord;
          this.generateCalendar(this.currentMonth);
        }
      }
    },
    error: (e) => {
      this.message = e?.message || 'Check-out failed';
    }
  });

  this.generateCalendar(this.currentMonth);
}
  


generateCalendar(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  this.calendarDays = [];

  // Leading empty days for alignment
  for (let i = 0; i < firstDay.getDay(); i++) {
    this.calendarDays.push({ date: new Date(year, month, 0 - (firstDay.getDay() - i)), isCurrentMonth: false });
  }

  // Actual days
  const today = new Date();
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const currentDate = new Date(year, month, d);
    const record = this.records.find(r => r.attendance_date_obj?.toDateString() === currentDate.toDateString());

    let status = null;

    if (record) {
      status = this.mapStatus(record.status); // use record
    } else {
      const dayOfWeek = currentDate.getDay(); // 0=Sunday, 6=Saturday
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        status = 'Weekly Off'; // weekends
      } else if (currentDate < today) {
        status = 'Absent'; // past weekdays with no record
      } else {
        status = null; // future days -> no color / no count
      }
    }

    this.calendarDays.push({ date: currentDate, record, isCurrentMonth: true, status });
  }

  this.updateStatusSummary();
}



updateStatusSummary() {
  this.statusList.forEach(s => s.count = 0);

  this.calendarDays.forEach(day => {
    if (!day.isCurrentMonth) return;

    if (!day.status) return; // skip future days

    const statusObj = this.statusList.find(
      s => s.name.toLowerCase() === day.status.toLowerCase()
    );

    if (statusObj) {
      statusObj.count++;
    }
  });
}

  prevMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.generateCalendar(this.currentMonth);
  }

  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.generateCalendar(this.currentMonth);
  }

  statusList = [
  { name: 'Present', class: 'status-present', count: 0 },
  { name: 'Absent', class: 'status-absent', count: 0 },
  { name: 'Half Day', class: 'status-halfday', count: 0 },
  { name: 'Late', class: 'status-late', count: 0 },
  { name: 'Fine', class: 'status-fine', count: 0 },
  { name: 'Weekly Off', class: 'status-weeklyoff', count: 0 },
  { name: 'Overtime', class: 'status-overtime', count: 0 },
];


}