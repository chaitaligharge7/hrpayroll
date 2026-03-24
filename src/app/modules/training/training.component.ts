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
  loading = false;
  activeTab = 'programs';

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
    this.loading = true;
    this.trainingService.getPrograms().subscribe({
      next: (response) => {
        if (response.success) {
          this.programs = response.data || [];
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading programs:', error);
        this.loading = false;
      }
    });
  }

  loadCourses(): void {
    this.trainingService.getCourses().subscribe({
      next: (response) => {
        if (response.success) {
          this.courses = response.data || [];
        }
      },
      error: (error) => {
        console.error('Error loading courses:', error);
      }
    });
  }

  loadEnrollments(): void {
    this.trainingService.getEnrollments().subscribe({
      next: (response) => {
        if (response.success) {
          this.enrollments = response.data || [];
        }
      },
      error: (error) => {
        console.error('Error loading enrollments:', error);
      }
    });
  }

  createProgram(): void {
    this.router.navigate(['/training/programs/create']);
  }

  createCourse(): void {
    this.router.navigate(['/training/courses/create']);
  }

  enrollInTraining(programId?: number, courseId?: number): void {
    this.router.navigate(['/training/enroll'], { queryParams: { program_id: programId, course_id: courseId } });
  }
}

