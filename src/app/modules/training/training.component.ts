import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TrainingService } from './training.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss'],
  standalone: false
})
export class TrainingComponent implements OnInit {
  programs: any[] = [];
  courses: any[] = [];
  enrollments: any[] = [];
  loadingPrograms = false;
  loadingCourses = false;
  loadingEnrollments = false;
  activeTab = 'programs';

  // Program filters
  programSearch = '';
  programStatusFilter = '';
  programStatusOptions = ['Draft', 'Scheduled', 'Ongoing', 'Completed', 'Cancelled'];

  // Course filters
  courseSearch = '';
  courseTypeFilter = '';
  courseTypeOptions = ['Mandatory', 'Optional', 'Certification', 'Skill Development'];

  // Enrollment filters
  enrollmentSearch = '';
  enrollmentStatusFilter = '';
  enrollmentStatusOptions = ['Enrolled', 'In Progress', 'Completed', 'Dropped', 'Failed'];

  get filteredEnrollments(): any[] {
    const search = this.enrollmentSearch.trim().toLowerCase();
    return this.enrollments.filter(e => {
      const matchSearch = !search ||
        (e.first_name + ' ' + e.last_name).toLowerCase().includes(search) ||
        (e.employee_code || '').toLowerCase().includes(search) ||
        (e.program_name || '').toLowerCase().includes(search) ||
        (e.course_name || '').toLowerCase().includes(search);
      const matchStatus = !this.enrollmentStatusFilter || e.status === this.enrollmentStatusFilter;
      return matchSearch && matchStatus;
    });
  }

  get filteredPrograms(): any[] {
    const search = this.programSearch.trim().toLowerCase();
    return this.programs.filter(p => {
      const matchSearch = !search ||
        (p.program_name || '').toLowerCase().includes(search) ||
        (p.program_code || '').toLowerCase().includes(search);
      const matchStatus = !this.programStatusFilter || p.status === this.programStatusFilter;
      return matchSearch && matchStatus;
    });
  }

  get filteredCourses(): any[] {
    const search = this.courseSearch.trim().toLowerCase();
    return this.courses.filter(c => {
      const matchSearch = !search ||
        (c.course_name || '').toLowerCase().includes(search) ||
        (c.course_code || '').toLowerCase().includes(search);
      const matchType = !this.courseTypeFilter || c.course_type === this.courseTypeFilter;
      return matchSearch && matchType;
    });
  }

  constructor(
    private trainingService: TrainingService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Support returning from enrollment form via ?tab=enrollments
    const tabParam = this.route.snapshot.queryParamMap.get('tab');
    const pathParam = this.route.snapshot.routeConfig?.path ?? '';
    if (tabParam) {
      this.activeTab = tabParam;
    } else {
      this.activeTab = pathParam === 'enroll' ? 'enrollments' : 'programs';
    }

    this.loadPrograms();
    this.loadCourses();
    this.loadEnrollments();
  }

  loadPrograms(): void {
    this.loadingPrograms = true;
    this.trainingService.getPrograms().subscribe({
      next: (response) => {
        if (response.success) {
          this.programs = response.data || [];
        }
        this.loadingPrograms = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading programs:', error);
        this.loadingPrograms = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadCourses(): void {
    this.loadingCourses = true;
    this.trainingService.getCourses().subscribe({
      next: (response) => {
        if (response.success) {
          this.courses = response.data || [];
        }
        this.loadingCourses = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.loadingCourses = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadEnrollments(): void {
    this.loadingEnrollments = true;
    this.trainingService.getEnrollments().subscribe({
      next: (response) => {
        if (response.success) {
          this.enrollments = response.data || [];
        }
        this.loadingEnrollments = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading enrollments:', error);
        this.loadingEnrollments = false;
      }
    });
  }

  createEnrollment(): void {
    this.router.navigate(['/training/enrollments/create']);
  }

  viewEnrollment(id: number): void {
    this.router.navigate(['/training/enrollments/view', id]);
  }

  editEnrollment(id: number): void {
    this.router.navigate(['/training/enrollments/edit', id]);
  }

  deleteEnrollment(enrollment: any): void {
    if (confirm(`Remove enrollment for ${enrollment.first_name} ${enrollment.last_name}?`)) {
      this.enrollments = this.enrollments.filter(e => e.enrollment_id !== enrollment.enrollment_id);
      this.trainingService.deleteEnrollment(enrollment.enrollment_id).subscribe({
        error: () => { this.loadEnrollments(); }
      });
    }
  }

  createProgram(): void {
    this.router.navigate(['/training/programs/create']);
  }

  createCourse(): void {
    this.router.navigate(['/training/courses/create']);
  }

  viewProgram(id: number): void {
    this.router.navigate(['/training/programs/edit', id]);
  }

  editProgram(id: number): void {
    this.router.navigate(['/training/programs/edit', id]);
  }

  deleteProgram(program: any): void {
    if (confirm(`Are you sure you want to delete Training Program "${program.program_name}"?`)) {
      this.programs = this.programs.filter(p => p.program_id !== program.program_id);
      this.trainingService.deleteProgram(program.program_id).subscribe({
        error: () => {
          // restore on failure
          this.loadPrograms();
        }
      });
    }
  }

  viewCourse(id: number): void {
    this.router.navigate(['/training/courses/edit', id]);
  }

  editCourse(id: number): void {
    this.router.navigate(['/training/courses/edit', id]);
  }

  deleteCourse(course: any): void {
    if (confirm(`Are you sure you want to delete Training Course "${course.course_name}"?`)) {
      this.courses = this.courses.filter(c => c.course_id !== course.course_id);
      this.trainingService.deleteCourse(course.course_id).subscribe({
        error: () => {
          // restore on failure
          this.loadCourses();
        }
      });
    }
  }

  enrollInTraining(_programId?: number, _courseId?: number): void {
    this.router.navigate(['/training/enrollments/create']);
  }
}

