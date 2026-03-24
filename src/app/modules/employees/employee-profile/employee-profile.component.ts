import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService, Employee } from '../employee.service';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.scss'],
  standalone: false
})
export class EmployeeProfileComponent implements OnInit {
  employee: Employee | null = null;
  employeeId: number | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) {
        this.router.navigate(['/employees']);
        return;
      }
      this.employeeId = +id;
      this.loadEmployee(this.employeeId);
    });
  }

  loadEmployee(id: number): void {
    this.loading = true;
    this.error = null;
    this.employeeService.getEmployee(id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.employee = res.data;
        } else {
          this.error = res.message || 'Unable to load employee';
        }
        this.loading = false;
      },
      error: (e) => {
        this.error = e?.message || 'Unable to load employee';
        this.loading = false;
      }
    });
  }

  edit(): void {
    if (this.employeeId) {
      this.router.navigate(['/employees', this.employeeId, 'edit']);
    }
  }
}
