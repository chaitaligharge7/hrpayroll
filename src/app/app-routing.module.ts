import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./core/guards/auth.guard";
import { LoginComponent } from "./modules/auth/login/login.component";
import { DashboardComponent } from "./modules/dashboard/dashboard.component";

const routes: Routes = [
  { path: "", redirectTo: "/dashboard", pathMatch: "full" },
  { path: "login", component: LoginComponent },

  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },

  {
    path: "employees",
    loadChildren: () =>
      import("./modules/employees/employees.module").then(
        (m) => m.EmployeesModule,
      ),
    canActivate: [AuthGuard],
  },

  {
    path: "recruitment",
    loadChildren: () =>
      import("./modules/recruitment/recruitment.module").then(
        (m) => m.RecruitmentModule,
      ),
    canActivate: [AuthGuard],
  },

  {
    path: "assets",
    loadChildren: () =>
      import("./modules/assets/assets.module").then((m) => m.AssetsModule),
    canActivate: [AuthGuard],
  },

  {
    path: "expenses",
    loadChildren: () =>
      import("./modules/expenses/expenses.module").then(
        (m) => m.ExpensesModule,
      ),
    canActivate: [AuthGuard],
  },

  {
    path: "projects",
    loadChildren: () =>
      import("./modules/projects/projects.module").then(
        (m) => m.ProjectsModule,
      ),
    canActivate: [AuthGuard],
  },

  {
    path: "timesheets",
    loadChildren: () =>
      import("./modules/timesheets/timesheets.module").then(
        (m) => m.TimesheetsModule,
      ),
    canActivate: [AuthGuard],
  },

  {
    path: "payroll",
    loadChildren: () =>
      import("./modules/payroll/payroll.module").then((m) => m.PayrollModule),
    canActivate: [AuthGuard],
  },

  {
    path: "attendance",
    loadChildren: () =>
      import("./modules/attendance/attendance.module").then(
        (m) => m.AttendanceModule,
      ),
    canActivate: [AuthGuard],
  },

  {
    path: "leaves",
    loadChildren: () =>
      import("./modules/leaves/leaves.module").then((m) => m.LeavesModule),
    canActivate: [AuthGuard],
  },

  {
    path: "reports",
    loadChildren: () =>
      import("./modules/reports/reports.module").then((m) => m.ReportsModule),
    canActivate: [AuthGuard],
  },

  {
    path: "settings",
    loadChildren: () =>
      import("./modules/settings/settings.module").then(
        (m) => m.SettingsModule,
      ),
    canActivate: [AuthGuard],
  },

  {
    path: "letters",
    loadChildren: () =>
      import("./modules/letters/letters.module").then((m) => m.LettersModule),
    canActivate: [AuthGuard],
  },

  {
    path: "documents",
    loadChildren: () =>
      import("./modules/documents/documents.module").then(
        (m) => m.DocumentsModule,
      ),
    canActivate: [AuthGuard],
  },

  {
    path: "training",
    loadChildren: () =>
      import("./modules/training/training.module").then(
        (m) => m.TrainingModule,
      ),
    canActivate: [AuthGuard],
  },

  {
    path: "performance",
    loadChildren: () =>
      import("./modules/performance/performance.module").then(
        (m) => m.PerformanceModule,
      ),
    canActivate: [AuthGuard],
  },

  {
    path: "shifts",
    loadChildren: () =>
      import("./modules/shifts/shifts.module").then((m) => m.ShiftsModule),
    canActivate: [AuthGuard],
  },

  {
    path: "compliance",
    loadChildren: () =>
      import("./modules/compliance/compliance.module").then(
        (m) => m.ComplianceModule,
      ),
    canActivate: [AuthGuard],
  },

  {
    path: "departments",
    loadChildren: () =>
      import("./modules/departments/departments.module").then(
        (m) => m.DepartmentModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "designations",
    loadChildren: () =>
      import("./modules/designations/designations.module").then(
        (m) => m.DesignationsModule,
      ),
    canActivate: [AuthGuard],
  },
  { path: "**", redirectTo: "/dashboard" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
