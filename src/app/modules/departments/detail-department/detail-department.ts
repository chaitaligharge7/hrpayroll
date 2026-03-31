import { CommonModule } from "@angular/common";
import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DepartmentsService } from "../departments.service";

@Component({
  selector: "app-detail-department",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./detail-department.html",
  styleUrls: ["./detail-department.scss"],
})
export class DetailDepartment implements OnInit {
  departmentId!: number;
  department: any = null;

  loading = true;
  error = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private departmentService: DepartmentsService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.departmentId = Number(this.route.snapshot.paramMap.get("id"));
    if (!this.departmentId || isNaN(this.departmentId)) {
      this.error = "Invalid department ID.";
      this.loading = false;
      return;
    }

    this.getDepartment();
  }

  getDepartment() {
    this.loading = true;
    this.error = "";

    this.departmentService.getDepartment(this.departmentId).subscribe({
      next: (res) => {
        if (res && res.success) {
          this.department = res.data;
          if (!this.department || Object.keys(this.department).length === 0) {
            this.error = "Department not found.";
          }
        } else {
          this.error = res?.message || "Failed to load department.";
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = "Failed to load department (network/API error).";
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  goBack() {
    this.router.navigate(["/departments"]);
  }

  edit() {
    this.router.navigate(["/departments", this.departmentId, "edit"]);
  }
}
