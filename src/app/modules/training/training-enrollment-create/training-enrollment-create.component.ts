import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TrainingService } from '../training.service';
import { EmployeeService } from '../../employees/employee.service';

@Component({
  selector: 'app-training-enrollment-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './training-enrollment-create.component.html',
  styleUrls: ['./training-enrollment-create.component.scss']
})
export class TrainingEnrollmentCreateComponent implements OnInit {
  form: any = {
    employee_id: '',
    course_id: '',
    program_id: '',
    enrolled_date: new Date().toISOString().substring(0, 10),
    status: 'Enrolled'
  };

  isEditMode = false;
  enrollmentId: number | null = null;
  loading = false;
  errorMessage = '';
  successMessage = '';

  employees: any[] = [];
  programs: any[] = [];
  courses: any[] = [];

  constructor(
    private trainingService: TrainingService,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.loadPrograms();
    this.loadCourses();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.enrollmentId = +id;
      this.loadEnrollment();
    }
  }

  loadEmployees(): void {
    this.employeeService.getEmployees({ limit: 1000 }).subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.employees = res.data.employees || [];
          this.cdr.detectChanges();
        }
      },
      error: () => {}
    });
  }

  loadPrograms(): void {
    this.trainingService.getPrograms().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.programs = res.data || [];
          this.cdr.detectChanges();
        }
      },
      error: () => {}
    });
  }

  loadCourses(): void {
    this.trainingService.getCourses().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.courses = res.data || [];
          this.cdr.detectChanges();
        }
      },
      error: () => {}
    });
  }

  loadEnrollment(): void {
    this.trainingService.getEnrollments({ enrollment_id: this.enrollmentId! }).subscribe({
      next: (res: any) => {
        if (res.success && res.data && res.data.length > 0) {
          const e = res.data[0];
          this.form = {
            employee_id:   e.employee_id   || '',
            course_id:     e.course_id     || '',
            program_id:    e.program_id    || '',
            enrolled_date: e.enrolled_date ? e.enrolled_date.substring(0, 10) : '',
            status:        e.status        || 'Enrolled'
          };
          this.cdr.detectChanges();
        } else {
          this.errorMessage = 'Enrollment not found.';
        }
      },
      error: () => {
        this.errorMessage = 'Failed to load enrollment.';
      }
    });
  }

  onCourseChange(): void {
    const course = this.courses.find(c => c.course_id === +this.form.course_id);
    if (course && course.program_id) {
      this.form.program_id = course.program_id;
    }
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.form.employee_id) {
      this.errorMessage = 'Please select an employee.';
      return;
    }
    if (!this.form.course_id && !this.form.program_id) {
      this.errorMessage = 'Please select a course or a program.';
      return;
    }

    this.loading = true;

    const payload: any = {
      employee_id:   +this.form.employee_id,
      enrolled_date: this.form.enrolled_date,
      status:        this.form.status
    };
    if (this.form.course_id)  payload.course_id  = +this.form.course_id;
    if (this.form.program_id) payload.program_id = +this.form.program_id;

    if (this.isEditMode && this.enrollmentId) {
      this.trainingService.updateEnrollment(this.enrollmentId, payload).subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res.success) {
            this.successMessage = 'Enrollment updated successfully!';
            this.errorMessage = '';
            this.cdr.detectChanges();
            setTimeout(() => {
              this.router.navigate(['/training'], { queryParams: { tab: 'enrollments' } });
            }, 1200);
          } else {
            this.errorMessage = res.message || 'Failed to update enrollment.';
            this.cdr.detectChanges();
          }
        },
        error: (err: any) => {
          this.loading = false;
          this.errorMessage = err?.message || err?.error?.message || 'An error occurred. Please try again.';
          this.cdr.detectChanges();
        }
      });
    } else {
      this.trainingService.createEnrollment(payload).subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res.success) {
            this.cdr.detectChanges();
            this.router.navigate(['/training'], { queryParams: { tab: 'enrollments' } });
          } else {
            this.errorMessage = res.message || 'Failed to enroll employee.';
            this.cdr.detectChanges();
          }
        },
        error: (err: any) => {
          this.loading = false;
          this.errorMessage = err?.message || err?.error?.message || 'An error occurred. Please try again.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/training'], { queryParams: { tab: 'enrollments' } });
  }
}
