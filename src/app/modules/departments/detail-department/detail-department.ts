import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-detail-department",
  imports: [FormsModule, CommonModule],
  templateUrl: "./detail-department.html",
  styleUrl: "./detail-department.scss",
})
export class DetailDepartment {
  departmentId!: number;
  department: any = null;

  loading = true;
  error = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.departmentId = Number(this.route.snapshot.paramMap.get("id"));
    console.log("Department ID:", this.departmentId); // 👈 ADD THIS

    this.getDepartment();
  }

  getDepartment() {
    this.loading = true;
    this.error = "";

    this.http
      .get<any>(`/api/v1/departments/get.php?id=${this.departmentId}`)
      .subscribe({
        next: (res) => {
          this.department = res.data || res;
          this.loading = false;
        },
        error: (err) => {
          this.error = "Failed to load department";
          this.loading = false;
        },
      });
  }

  goBack() {
    this.router.navigate(["/departments"]);
  }
}
