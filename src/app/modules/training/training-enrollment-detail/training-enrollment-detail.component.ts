import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-training-enrollment-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './training-enrollment-detail.component.html',
  styleUrls: ['./training-enrollment-detail.component.scss']
})
export class TrainingEnrollmentDetailComponent implements OnInit {
  enrollment: any = null;
  loading = true;
  errorMessage = '';
  enrollmentId: number | null = null;

  constructor(
    private trainingService: TrainingService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.enrollmentId = +id;
      this.loadEnrollment();
    } else {
      this.loading = false;
      this.errorMessage = 'No enrollment ID provided.';
    }
  }

  loadEnrollment(): void {
    this.loading = true;
    this.trainingService.getEnrollments({ enrollment_id: this.enrollmentId! }).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          this.enrollment = res.data[0];
        } else if (res.success && res.data && !Array.isArray(res.data)) {
          this.enrollment = res.data;
        } else {
          this.errorMessage = 'Enrollment not found.';
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Failed to load enrollment details.';
        this.cdr.detectChanges();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/training'], { queryParams: { tab: 'enrollments' } });
  }

  editEnrollment(): void {
    if (this.enrollmentId) {
      this.router.navigate(['/training/enrollments/edit', this.enrollmentId]);
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Completed': return 'badge-success';
      case 'In Progress':
      case 'Enrolled':  return 'badge-primary';
      case 'Pending':   return 'badge-warning';
      case 'Dropped':
      case 'Failed':
      case 'Cancelled': return 'badge-danger';
      default:          return 'badge-warning';
    }
  }
}
