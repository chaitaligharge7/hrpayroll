import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { DesignationsService } from "../designations.service";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-designation-list",
  imports: [FormsModule, CommonModule],
  templateUrl: "./designation-list.html",
  styleUrl: "./designation-list.scss",
})
export class DesignationListComponent implements OnInit {
  designations: any[] = [];
  loading = false;
  page = 1;
  limit = 20;
  total = 0;

  searchTerm = "";
  pagination = {
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0,
  };

  constructor(
    private designationService: DesignationsService,
    private router: Router,
    private cdr: ChangeDetectorRef, 
  ) {}

  ngOnInit(): void {
    this.loadDesignations(); 
  }

  loadDesignations(): void {
    this.loading = true;

    const params = {
      search: this.searchTerm, 
    };

    this.designationService.getDesignations(params).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.designations = res.data || [];
        }
        this.loading = false;
        this.cdr.detectChanges(); 
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onSearch(): void {
    this.loadDesignations(); 
  }

  createDesignation(): void {
    this.router.navigate(["/designations/create"]); 
  }

  editDesignation(item: any): void {
    this.router.navigate(["/designations", item.designation_id, "edit"]);
  }
  onPageChange(page: number): void {
    if (page < 1 || page > this.pagination.total_pages) {
      return;
    }
    this.page = page;
    this.pagination.page = page;
    this.loadDesignations();
  }

  goToDepartments() {
    this.router.navigate(["/departments"]);
  }
  goToEmployees() {
    this.router.navigate(["/employees"]);
  }

  deleteDesignation(designation: any): void {
    if (!designation?.designation_id) return;

    const confirmDelete = confirm(
      `Are you sure you want to delete designation "${designation.designation_name}"?`,
    );

    if (!confirmDelete) return;

    this.loading = true;

    this.designationService
      .deleteDesignation(designation.designation_id)
      .subscribe({
        next: (res: any) => {
          if (res?.success) {
            alert("Designation deleted successfully");

            this.loadDesignations();
          } else {
            alert(res?.message || "Delete failed");
          }

          this.loading = false;
        },
        error: (err) => {
          console.error("DELETE ERROR:", err);
          alert(err?.error?.message || "Error deleting designation");
          this.loading = false;
        },
      });
  }
}
