import { Component, OnInit } from "@angular/core";
import { DepartmentsService } from "../departments.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ChangeDetectorRef } from "@angular/core";

@Component({
  selector: "app-create-department",
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: "./create-department.html",
  styleUrls: ["./create-department.scss"],
})
export class CreateDepartment implements OnInit {
  form: any = {
    department_name: "",
    department_code: "",
    department_description: "",
    parent_department_id: null,
    head_employee_id: null,
    cost_center: "",
    is_active: 1,
  };

  loading = false;
  isEditMode = false;
  departmentId: number | null = null;

  constructor(
    private departmentService: DepartmentsService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get("id");

    if (idParam) {
      this.departmentId = Number(idParam);

      if (!isNaN(this.departmentId)) {
        this.isEditMode = true;
        this.loadDepartment();
      }
    }
  }

  loadDepartment(): void {
    if (!this.departmentId) return;

    this.loading = true;

    this.departmentService.getDepartment(this.departmentId).subscribe({
      next: (res: any) => {
        console.log("GET Department Response:", res);

        if (res?.success && res?.data) {
          const data = res.data; // ✅ FIX ADDED

          this.form.department_name = data.department_name || "";
          this.form.department_code = data.department_code || "";
          this.form.department_description = data.department_description || "";
          this.form.parent_department_id = data.parent_department_id || null;
          this.form.head_employee_id = data.head_employee_id || null;
          this.form.cost_center = data.cost_center || "";
          this.form.is_active = data.is_active ?? 1;

          this.cdr.detectChanges(); // ✅ optional but good
        } else {
          alert("Invalid response from server");
        }

        this.loading = false;
      },
      error: (err) => {
        console.error("GET ERROR:", err); // ✅ DEBUG
        alert("Error loading department");
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (!this.form.department_name || !this.form.department_code) {
      alert("Name and Code are required");
      return;
    }

    console.log("FORM DATA:", this.form); // ✅ DEBUG

    this.loading = true;

    const request = this.isEditMode
      ? this.departmentService.updateDepartment(this.departmentId!, this.form)
      : this.departmentService.createDepartment(this.form);

    request.subscribe({
      next: (res: any) => {
        console.log("API RESPONSE:", res); // ✅ DEBUG

        if (res?.success) {
          alert(
            `Department ${this.isEditMode ? "updated" : "created"} successfully`,
          );
          this.router.navigate(["/departments"]);
        } else {
          alert(res?.message || "Operation failed");
        }

        this.loading = false;
      },
      error: (err) => {
        console.error("API ERROR:", err); // ✅ DEBUG

        alert(
          err?.error?.message ||
            err?.message ||
            `Error ${this.isEditMode ? "updating" : "creating"} department`,
        );

        this.loading = false;
      },
    });
  }
    cancel(): void {
    this.router.navigate(["/designations"]);
  }
}
