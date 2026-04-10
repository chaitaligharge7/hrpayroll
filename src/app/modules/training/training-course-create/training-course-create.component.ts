import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-training-course-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './training-course-create.component.html',
  styleUrls: ['./training-course-create.component.scss']
})
export class TrainingCourseCreateComponent implements OnInit {
  form: any = {
    course_code: '',
    course_name: '',
    program_id: '',
    course_type: '',
    course_description: '',
    duration_hours: '',
    course_url: ''
  };

  programs: any[] = [];
  isEditMode = false;
  courseId: number | null = null;
  loading = false;
  loadingData = false;
  loadingPrograms = false;
  errorMessage = '';

  courseTypes = ['Mandatory', 'Optional', 'Certification', 'Skill Development'];

  constructor(
    private trainingService: TrainingService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.courseId = +id;
    }
    this.loadPrograms();
  }

  loadCourse(): void {
    this.loadingData = true;
    this.trainingService.getCourse(this.courseId!).subscribe({
      next: (res: any) => {
        this.loadingData = false;
        if (res.success && res.data) {
          const c = res.data;
          this.form = {
            course_code: c.course_code || '',
            course_name: c.course_name || '',
            program_id: c.program_id ? String(c.program_id) : '',
            course_type: c.course_type || '',
            course_description: c.course_description || '',
            duration_hours: c.duration_hours || '',
            course_url: c.course_url || ''
          };
          this.cdr.detectChanges();
        } else {
          this.errorMessage = 'Course not found.';
        }
      },
      error: () => {
        this.loadingData = false;
        this.errorMessage = 'Failed to load course.';
      }
    });
  }

  loadPrograms(): void {
    this.loadingPrograms = true;
    this.trainingService.getPrograms().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.programs = res.data || [];
        }
        this.loadingPrograms = false;
        this.cdr.detectChanges();
        if (this.isEditMode && this.courseId) {
          this.loadCourse();
        }
      },
      error: () => {
        this.loadingPrograms = false;
        if (this.isEditMode && this.courseId) {
          this.loadCourse();
        }
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.form.course_code || !this.form.course_name) {
      this.errorMessage = 'Course code and name are required.';
      return;
    }

    this.loading = true;

    const payload: any = {};
    Object.keys(this.form).forEach(key => {
      if (this.form[key] !== '' && this.form[key] !== null) {
        payload[key] = this.form[key];
      }
    });

    if (this.isEditMode && this.courseId) {
      this.trainingService.updateCourse(this.courseId, payload).subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res.success) {
            this.router.navigate(['/training']);
          } else {
            this.errorMessage = res.message || 'Failed to update course.';
          }
        },
        error: (err: any) => {
          this.loading = false;
          this.errorMessage = err?.error?.message || 'An error occurred. Please try again.';
        }
      });
    } else {
      this.trainingService.createCourse(payload).subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res.success) {
            this.router.navigate(['/training']);
          } else {
            this.errorMessage = res.message || 'Failed to create course.';
          }
        },
        error: (err: any) => {
          this.loading = false;
          this.errorMessage = err?.error?.message || 'An error occurred. Please try again.';
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/training']);
  }
}
