import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  deleteModal = {
    show: false,
    type: '' as 'program' | 'course' | '',
    id: 0,
    name: '',
    loading: false
  };

  constructor(
    private trainingService: TrainingService,
    private router: Router
  ) {}

  ngOnInit(): void {
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
      },
      error: (error) => {
        console.error('Error loading programs:', error);
        this.loadingPrograms = false;
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
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.loadingCourses = false;
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
      },
      error: (error) => {
        console.error('Error loading enrollments:', error);
        this.loadingEnrollments = false;
      }
    });
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
    this.deleteModal = { show: true, type: 'program', id: program.program_id, name: program.program_name, loading: false };
  }

  viewCourse(id: number): void {
    this.router.navigate(['/training/courses/edit', id]);
  }

  editCourse(id: number): void {
    this.router.navigate(['/training/courses/edit', id]);
  }

  deleteCourse(course: any): void {
    this.deleteModal = { show: true, type: 'course', id: course.course_id, name: course.course_name, loading: false };
  }

  closeDeleteModal(): void {
    if (!this.deleteModal.loading) {
      this.deleteModal = { show: false, type: '', id: 0, name: '', loading: false };
    }
  }

  confirmDelete(): void {
    this.deleteModal.loading = true;
    const obs = this.deleteModal.type === 'program'
      ? this.trainingService.deleteProgram(this.deleteModal.id)
      : this.trainingService.deleteCourse(this.deleteModal.id);

    obs.subscribe({
      next: () => {
        if (this.deleteModal.type === 'program') {
          this.programs = this.programs.filter(p => p.program_id !== this.deleteModal.id);
        } else {
          this.courses = this.courses.filter(c => c.course_id !== this.deleteModal.id);
        }
        this.closeDeleteModal();
      },
      error: () => {
        this.deleteModal.loading = false;
      }
    });
  }

  enrollInTraining(programId?: number, courseId?: number): void {
    this.router.navigate(['/training/enroll'], { queryParams: { program_id: programId, course_id: courseId } });
  }
}

