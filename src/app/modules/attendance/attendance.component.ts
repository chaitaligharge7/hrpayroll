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
  status?: string;
  check_in_time_obj?: Date | null;
  check_out_time_obj?: Date | null;
  attendance_date_obj?: Date;
  check_in_location?: string | null;
  check_out_location?: string | null;
}

@Component({
  selector: 'app-attendance',
  standalone: false,
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
})
export class AttendanceComponent implements OnInit {
   parseLocalDateTime(dateTimeStr: string | null): Date | null {
    if (!dateTimeStr) return null;
    const [datePart, timePart] = dateTimeStr.split(' ');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes, seconds); // Local
  }
liveCheckInTime: Date | null = null;
liveInterval: any;
showForm = false;
date = '';
reason = '';


  
checkInForSelectedEmployee() {
  if (!this.selectedEmployeeId) return;

  const today = new Date();
  const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  // Check if already checked in
  const existingRecord = this.records.find(r =>
    r.employee_id === this.selectedEmployeeId &&
    r.attendance_date_obj &&
    this.isSameDay(r.attendance_date_obj!, dateOnly)
  );

  if (existingRecord && existingRecord.check_in_time_obj) {
    this.message = 'Check-in already done for today';
    return;
  }

  const location = this.location || '';

  this.attendanceService.checkIn(location).subscribe({
    next: (res: any) => {
      if (res.success && res.data && res.data.attendance) {
        const savedRecord = res.data.attendance;

        // Create record compatible with backend
        const record = {
          ...savedRecord,
          attendance_date_obj: new Date(savedRecord.attendance_date), // exact match backend YYYY-MM-DD
         check_in_time_obj: this.parseLocalDateTime(savedRecord.check_in_time),
         check_out_time_obj: this.parseLocalDateTime(savedRecord.check_out_time),
          status: savedRecord.attendance_status || 'Present',
          first_name: this.getUniqueEmployees().find(e => e.employee_id === this.selectedEmployeeId)?.first_name || '',
          last_name: this.getUniqueEmployees().find(e => e.employee_id === this.selectedEmployeeId)?.last_name || ''
        };

        this.records = this.records.filter(r =>
          !(r.employee_id === record.employee_id && this.isSameDay(r.attendance_date_obj!, dateOnly))
        );
        this.records.push(record);
        this.liveCheckInTime = record.check_in_time_obj;
        this.startLiveTimer();

        this.message = 'Check-in done successfully';
        this.cdr.detectChanges();
      } else {
        this.message = res.message || 'Failed to check in';
      }
    },
    error: (err) => {
      console.error('API Error:', err);
      this.message = err?.error?.message || 'Failed to check in';
    }
  });
}

checkOutForSelectedEmployee() {
  if (!this.selectedEmployeeId) return;

  const today = new Date();
  const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const record = this.records.find(r =>
    r.employee_id === this.selectedEmployeeId &&
    r.attendance_date_obj &&
    this.isSameDay(r.attendance_date_obj, dateOnly)
  );

  if (!record || !record.check_in_time_obj) {
    this.message = 'No check-in found for today';
    return;
  }

  if (record.check_out_time_obj) {
    this.message = 'Check-out already done for today';
    return;
  }

  const location = this.location || '';
  this.attendanceService.checkOut(location).subscribe({
    next: (res: any) => {
      if (res.success && res.data && res.data.attendance) {
        const savedRecord = res.data.attendance;

        record.check_out_time_obj = this.parseLocalDateTime(savedRecord.check_out_time);
        record.status = savedRecord.attendance_status || record.status;

    
        if (this.liveInterval) {
          clearInterval(this.liveInterval);
          this.liveCheckInTime = null;
        }

        this.message = 'Check-out done successfully';
        this.cdr.detectChanges();
      } else {
        this.message = res.message || 'Failed to check out';
      }
    },
    error: (err) => {
      console.error('API Error:', err);
      this.message = err?.error?.message || 'Failed to check out';
    }
  });
}

startLiveTimer() {
  if (this.liveInterval) clearInterval(this.liveInterval);
  if (!this.liveCheckInTime) return;

  this.liveInterval = setInterval(() => {
    this.cdr.detectChanges();
  }, 1000);
}


  employeeSearch = '';
  records: AttendanceRecord[] = [];
  calendarDays: any[] = [];
  selectedEmployeeId: number | null = null;

  statusList = [
    { name: 'Present', class: 'status-present' },
    { name: 'Absent', class: 'status-absent' },
    { name: 'Half Day', class: 'status-halfday' },
    { name: 'Late', class: 'status-late' },
    { name: 'Weekly Off', class: 'status-weeklyoff' },
    { name: 'Overtime', class: 'status-overtime' },
  ];

  message: string | null = null;
  location = '';
  currentWeekStart = new Date();
  currentWeekEnd = new Date();
  tenantId: any;

  months = [
    'January','February','March','April','May','June','July','August','September','October','November','December'
  ];

  years: number[] = [];
  selectedMonth = new Date().getMonth();
  selectedYear = new Date().getFullYear();
  week: any[] | null | undefined;
  constructor(
    private attendanceService: AttendanceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.tenantId = user.tenant_id;

    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      this.years.push(i);
    }

    this.generateWeek(new Date()); // show current week only
  this.loadAttendance();
  
   
    this.loadAttendance();
  }

loadAttendance(): void {
    this.attendanceService.getAttendanceList({ page: 1, limit: 50 }).subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.records = res.data.attendance.map((r: AttendanceRecord) => ({
            ...r,
            status: this.mapStatus(r.attendance_status),
            attendance_date_obj: new Date(r.attendance_date + 'T00:00:00'),
            check_in_time_obj: this.parseLocalDateTime(r.check_in_time),
           check_out_time_obj: this.parseLocalDateTime(r.check_out_time),
          }));

        } else {
          this.records = [];
        }

        this.setCurrentWeek(new Date());

        if (this.records.length > 0) {
          this.selectedEmployeeId = this.records[0].employee_id;

        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.message = err?.message || 'Failed to load attendance';
      },
    });
  }

getWeeklyStatusCount(emp: AttendanceRecord): Record<string, number> {
  const summary: Record<string, number> = {};
  this.statusList.forEach(s => summary[s.name] = 0);

  this.calendarDays.forEach((week: { date: Date | null }[]) => {
    week.forEach((day: { date: Date | null }) => {
      if (!day.date) return;
      const recs = this.getEmployeeRecordsForDay(emp, day);
      if (recs.length === 0) {
        const fallback = (day.date.getDay() === 0 || day.date.getDay() === 6) ? 'Weekly Off' : 'Absent';
        summary[fallback] = (summary[fallback] || 0) + 1;
      } else {
        const status = recs[0].status || 'Present';
        summary[status] = (summary[status] || 0) + 1;
      }
    });
  });

  return summary;
}

getDayClass(emp: AttendanceRecord, day: any) {
  if (!day.date) return 'blank-cell';

  const recs = this.getEmployeeRecordsForDay(emp, day);

  if (recs.length > 0) {
    return (
      this.statusList.find(s => s.name === recs[0].status)?.class || ''
    );
  }

  const fallback =
    day.date.getDay() === 0 || day.date.getDay() === 6
      ? 'Weekly Off'
      : 'Absent';

  return (
    this.statusList.find(s => s.name === fallback)?.class || ''
  );
}
  mapStatus(status: string): string {
    const s = status?.toLowerCase();
    if (s === 'late') return 'Late';
    if (s === 'half day') return 'Half Day';
    if (s === 'present') return 'Present';
    if (s === 'absent') return 'Absent';
    if (s === 'leave') return 'Leave';
    if (s === 'holiday') return 'Weekly Off';
    return status || 'Present';
  }

 isSameDay(d1: Date, d2: Date): boolean {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}



  getEmployeeRecord(emp: AttendanceRecord, day: Date) {
    return this.records.find(r =>
      r.employee_id === emp.employee_id &&
      r.attendance_date_obj &&
      this.isSameDay(r.attendance_date_obj, day)
    );
  }

  getEmployeeRecordsForDay(emp: AttendanceRecord, day: any) {
    if (!day.date) return [];
    return this.records.filter(r =>
      r.employee_id === emp.employee_id &&
      r.attendance_date_obj &&
      this.isSameDay(r.attendance_date_obj, day.date)
    );
  }

  getUniqueEmployees() {
    const map = new Map<number, AttendanceRecord>();
    this.records.forEach(r => {
      if (!map.has(r.employee_id)) map.set(r.employee_id, r);
    });
    return Array.from(map.values());
  }

  getFilteredEmployees() {
    const search = this.employeeSearch.trim().toLowerCase();
    return this.getUniqueEmployees().filter(emp =>
      emp.first_name.toLowerCase().includes(search) ||
      emp.last_name.toLowerCase().includes(search)
    );
  }

  generateMonth(year: number, month: number) {
    this.calendarDays = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startWeekDay = firstDay.getDay();
    let week: any[] = [];

    for (let i = 0; i < startWeekDay; i++) {
      week.push({ date: null });
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      week.push({ date: new Date(year, month, d) });
      if (week.length === 7) {
        this.calendarDays.push(week);
        week = [];
      }
    }

    if (week.length > 0) {
      while (week.length < 7) week.push({ date: null });
      this.calendarDays.push(week);
    }
  }

  onMonthYearChange() {
    this.generateMonth(this.selectedYear, this.selectedMonth);
  }

  setCurrentWeek(date: Date) {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    this.currentWeekStart = start;

    this.currentWeekEnd = new Date(start);
    this.currentWeekEnd.setDate(start.getDate() + 6);
  }

 generateWeek(referenceDate: Date) {
  const startOfWeek = new Date(referenceDate);
  startOfWeek.setDate(referenceDate.getDate() - referenceDate.getDay()); // Sunday start

  const week: any[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    week.push({ date: d });
  }

  this.calendarDays = [week]; // wrap in array to match *ngFor="let week of calendarDays"
  this.currentWeekStart = startOfWeek;
  this.currentWeekEnd = new Date(startOfWeek);
  this.currentWeekEnd.setDate(startOfWeek.getDate() + 6);
}

 prevWeek() {
  const d = new Date(this.currentWeekStart);
  d.setDate(d.getDate() - 7);
  this.generateWeek(d);
}

nextWeek() {
  const d = new Date(this.currentWeekStart);
  d.setDate(d.getDate() + 7);
  this.generateWeek(d);
}
loading = false;


regularizationList: any[] = [];

loadRegularization() {
  this.attendanceService.getRegularization().subscribe((res: any) => {
    if (res.success) {
      this.regularizationList = res.data;
    }
  });
}

approve(id: number) {
  this.attendanceService.approveRegularization(id, 'approve').subscribe({
    next: () => {
      this.message = 'Approved successfully';
      this.loadRegularization();
    }
  });
}

reject(id: number) {
  const reason = prompt('Enter rejection reason');
  if (!reason) return;

  this.attendanceService.approveRegularization(id, 'reject', reason).subscribe({
    next: () => {
      this.message = 'Rejected successfully';
      this.loadRegularization();
    }
  });
}
openRegularizeModal() {
  this.loadRegularization(); // load table
  this.date = new Date().toISOString().split('T')[0];
  this.reason = '';
  this.showForm = true;
}

closeModal() {
  this.showForm = false;
}


submit() {
  if (!this.date || !this.reason) {
    this.message = "Fill all fields";
    return;
  }

  const payload = {
    attendance_date: this.date,
    reason: this.reason,
    request_type: 'edit',
    employee_id: this.selectedEmployeeId
  };

  this.attendanceService.regularize(payload).subscribe({
    next: (res: any) => {
      this.message = "Request sent successfully";

      // ✅ IMPORTANT FIX
      this.showForm = false;
      this.date = '';
      this.reason = '';

      this.loadRegularization();
      this.loadAttendance();   // refresh table
    },
    error: (err) => {
      this.message = err?.error?.message || 'Error';
    }
  });
}
openRules() {
throw new Error('Method not implemented.');
}

}