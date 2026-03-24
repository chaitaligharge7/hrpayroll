import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
export class DashboardComponent implements OnInit {
  loading = false;
  stats: any = {
    total_employees: 0,
    active_employees: 0,
    total_payroll: 0,
    pending_leaves: 0,
    today_attendance: 0,
    present_today: 0
  };

  recentActivities: any[] = [];
  upcomingEvents: any[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.dashboardService.getDashboardData().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.stats = response.data.stats || this.stats;
          this.recentActivities = response.data.recent_activities || [];
          this.upcomingEvents = response.data.upcoming_events || [];
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard:', error);
        this.loading = false;
      }
    });
  }

  getActivityIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'Leave': 'bi bi-calendar-x',
      'Payroll': 'bi bi-cash-coin',
      'Attendance': 'bi bi-clock-history',
      'Compliance': 'bi bi-file-check',
      'Info': 'bi bi-info-circle',
      'Success': 'bi bi-check-circle',
      'Warning': 'bi bi-exclamation-triangle',
      'Error': 'bi bi-x-circle'
    };
    return icons[type] || 'bi bi-info-circle';
  }
}

