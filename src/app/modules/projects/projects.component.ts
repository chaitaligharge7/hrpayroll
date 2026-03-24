import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectsService } from './projects.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  standalone: false
})
export class ProjectsComponent implements OnInit {
  projects: any[] = [];
  loading = false;
  filters = {
    status: '',
    project_manager_id: null
  };

  constructor(
    private projectsService: ProjectsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    const params = { ...this.filters };

    this.projectsService.getProjects(params).subscribe({
      next: (response) => {
        if (response.success) {
          this.projects = response.data || [];
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.loading = false;
      }
    });
  }

  createProject(): void {
    this.router.navigate(['/projects/create']);
  }

  viewProject(projectId: number): void {
    this.router.navigate(['/projects', projectId]);
  }

  onFilterChange(): void {
    this.loadProjects();
  }
}

