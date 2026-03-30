import { Component, OnInit } from "@angular/core";
import { DashboardService } from "./dashboard.service";
import { ChangeDetectorRef } from "@angular/core"; // ✅ NEW

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  standalone: false,
})
export class DashboardComponent implements OnInit {
  loading = false;
  stats: any = {
    total_employees: 0,
    active_employees: 0,
    total_payroll: 0,
    pending_leaves: 0,
    today_attendance: 0,
    present_today: 0,
  };
  currentUser: any = null;

  currentDate = new Date();
  quickLinks: { title: string; route: string; icon: string; color: string }[] =
    [
      {
        title: "Students",
        route: "/app/students/list",
        icon: "bi-people",
        color: "primary",
      },
      {
        title: "Teachers",
        route: "/app/teachers/list",
        icon: "bi-person-badge",
        color: "success",
      },
      {
        title: "Attendance",
        route: "/app/attendance",
        icon: "bi-calendar-check",
        color: "info",
      },
      {
        title: "Fees",
        route: "/app/fees",
        icon: "bi-cash-stack",
        color: "warning",
      },
      {
        title: "Examinations",
        route: "/app/examinations",
        icon: "bi-journal-text",
        color: "secondary",
      },
      {
        title: "Notices",
        route: "/app/notices",
        icon: "bi-megaphone",
        color: "danger",
      },
      {
        title: "Admissions",
        route: "/app/admissions",
        icon: "bi-person-plus",
        color: "primary",
      },
      {
        title: "Timetable",
        route: "/app/timetable",
        icon: "bi-calendar-week",
        color: "info",
      },
      {
        title: "Reports",
        route: "/app/reports",
        icon: "bi-graph-up",
        color: "success",
      },
      {
        title: "Library",
        route: "/app/library",
        icon: "bi-book",
        color: "secondary",
      },
      {
        title: "Events",
        route: "/app/events",
        icon: "bi-calendar-event",
        color: "warning",
      },
      {
        title: "Homework",
        route: "/app/homework",
        icon: "bi-journal-bookmark",
        color: "primary",
      },
    ];
  isLoading = true;
  welcomeMessage = "";

  recentActivities: any[] = [];
  upcomingEvents: any[] = [];

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef, // ✅ ADD THIS
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }
  setWelcomeMessage(): void {
    const hour = new Date().getHours();
    const name = this.currentUser?.first_name || "Admin";
    if (hour < 12) this.welcomeMessage = `Good morning, ${name}`;
    else if (hour < 17) this.welcomeMessage = `Good afternoon, ${name}`;
    else this.welcomeMessage = `Good evening, ${name}`;
  }

  loadDashboardData(): void {
    this.loading = true;
    this.isLoading = true; // ✅ ADD THIS

    this.dashboardService.getDashboardData().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.stats = response.data.stats || this.stats;
          this.recentActivities = response.data.recent_activities || [];
          this.upcomingEvents = response.data.upcoming_events || [];
          // ✅ SET USER if available
          this.currentUser = response.data.user || null;

          // ✅ CALL THIS
          this.setWelcomeMessage();
        }
        this.loading = false;
        this.isLoading = false; // ✅ ADD THIS 🔥

        this.cdr.detectChanges(); // 🔥 THIS FIXES YOUR ISSUE
      },
      error: (error) => {
        console.error("Error loading dashboard:", error);
        this.loading = false;
        this.isLoading = false; // ✅ ADD THIS
      },
    });
  }

  getActivityIcon(type: string): string {
    const icons: { [key: string]: string } = {
      Leave: "bi bi-calendar-x",
      Payroll: "bi bi-cash-coin",
      Attendance: "bi bi-clock-history",
      Compliance: "bi bi-file-check",
      Info: "bi bi-info-circle",
      Success: "bi bi-check-circle",
      Warning: "bi bi-exclamation-triangle",
      Error: "bi bi-x-circle",
    };
    return icons[type] || "bi bi-info-circle";
  }
}
