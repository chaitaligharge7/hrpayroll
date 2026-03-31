import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { EmployeeService, Employee } from "../employee.service";

@Component({
  selector: "app-employee-profile",
  templateUrl: "./employee-profile.component.html",
  styleUrls: ["./employee-profile.component.scss"],
  standalone: false,
})
export class EmployeeProfileComponent implements OnInit {
  employee: Employee | null = null;
  employeeId: number | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");

    if (!id) {
      this.router.navigate(["/employees"]);
      return;
    }

    this.employeeId = +id;
    this.loadEmployee(this.employeeId);
  }

  // loadEmployee(id: number): void {
  //   this.loading = true;
  //   this.error = null;
  //   this.employeeService.getEmployee(id).subscribe({
  //     next: (res) => {
  //       if (res.success && res.data) {
  //         this.employee = res.data;
  //       } else {
  //         this.error = res.message || "Unable to load employee";
  //       }
  //       this.loading = false;
  //     },
  //     error: (e) => {
  //       this.error = e?.message || "Unable to load employee";
  //       this.loading = false;
  //     },
  //   });
  // }
  // loadEmployee(id: number): void {
  //   this.loading = true;
  //   this.error = null;

  //   console.log("Calling API with ID:", id); // 👈 ADD

  //   this.employeeService.getEmployee(id).subscribe({
  //     next: (res) => {
  //       console.log("API RESPONSE:", res); // 👈 ADD

  //       if (res.success && res.data) {
  //         this.employee = res.data;
  //       } else {
  //         this.error = res.message || "Unable to load employee";
  //       }

  //       this.loading = false;
  //       console.log("Loading set to false"); // 👈 ADD
  //     },
  //     error: (e) => {
  //       console.error("API ERROR:", e); // 👈 ADD
  //       this.error = e?.message || "Unable to load employee";
  //       this.loading = false;
  //     },
  //   });
  // }


  loadEmployee(id: number): void {
  this.loading = true;
  this.error = null;

  console.log("Calling API with ID:", id);

  this.employeeService.getEmployee(id).subscribe({
    next: (res) => {
      console.log("API RESPONSE:", res);

      if (res.success && res.data) {
        // ✅ SAFE ASSIGNMENT
        this.employee = res.data;
this.employeeId = +id;
      } else {
        this.employee = null;
        this.error = res.message || "Unable to load employee";
      }

      // ✅ FORCE UI UPDATE (IMPORTANT)
   
        this.loading = false;
        this.cdr.detectChanges();


    },
    error: (e) => {
      console.error("API ERROR:", e);
      this.error = e?.message || "Unable to load employee";


        this.loading = false;
        this.cdr.detectChanges();
 
    },
  });
}

  edit(): void {
    if (this.employeeId) {
      this.router.navigate(["/employees", this.employeeId, "edit"]);
    }
  }

  goBack(): void {
    this.router.navigate(["/employees"]);
  }
}
