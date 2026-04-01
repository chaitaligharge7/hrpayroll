import { Component } from "@angular/core";
import { DesignationsService } from "../designations.service";
import { ApiService } from "../../../core/services/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ChangeDetectorRef } from "@angular/core";

@Component({
  selector: "app-create-designation",
  imports: [FormsModule, CommonModule],
  templateUrl: "./create-designation.html",
  styleUrl: "./create-designation.scss",
})
export class CreateDesignation {
  form: any = {
    designation_name: "",
    designation_code: "",
    department_id: null,
    designation_description: "",
    is_active: 1,
  };

  departments: any[] = [];
  loading = false;

  isEditMode = false;
  designationId: number | null = null;

  constructor(
    private designationService: DesignationsService,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadDepartments();

    const idParam = this.route.snapshot.paramMap.get("id");

    if (idParam) {
      this.designationId = Number(idParam);

      if (!isNaN(this.designationId)) {
        this.isEditMode = true;
        this.loadDesignation();
      }
    }
  }

  loadDepartments(): void {
    this.api.get("departments/list").subscribe({
      next: (res: any) => {
        if (res.success) {
          this.departments = res.data || [];
        }
      },
      error: () => {
        alert("Failed to load departments");
      },
    });
  }

  loadDesignation(): void {
    if (!this.designationId) return;

    this.loading = true;

    this.designationService
      .getDesignations({ id: this.designationId })
      .subscribe({
        next: (res: any) => {
          console.log("GET DESIGNATION:", res);

          if (res?.success && res?.data?.length) {
            const data = res.data[0];

            // ✅ assign whole object (better)
            this.form = {
              designation_name: data.designation_name || "",
              designation_code: data.designation_code || "",
              department_id: Number(data.department_id) || null, // 🔥 force number
              designation_description: data.designation_description || "",
              is_active: data.is_active ?? 1,
            };

            this.cdr.detectChanges(); // ✅ correct place
          } else {
            alert("Designation not found");
          }

          this.loading = false;
        },
        error: () => {
          alert("Error loading designation");
          this.loading = false;
        },
      });
  }
  onSubmit(): void {
    if (!this.form.designation_name || !this.form.department_id) {
      alert("Name and Department are required");
      return;
    }

    this.loading = true;

    const request = this.isEditMode
      ? this.designationService.updateDesignation(
          this.designationId!,
          this.form,
        )
      : this.designationService.createDesignation(this.form);

    request.subscribe({
      next: (res: any) => {
        if (res?.success) {
          alert(
            `Designation ${this.isEditMode ? "updated" : "created"} successfully`,
          );
          this.router.navigate(["/designations"]);
        }
        this.loading = false;
      },
      error: (err) => {
        alert(
          err?.error?.message ||
            `Error ${this.isEditMode ? "updating" : "creating"} designation`,
        );
        this.loading = false;
      },
    });
  }

  cancel(): void {
    this.router.navigate(["/designations"]);
  }
}
