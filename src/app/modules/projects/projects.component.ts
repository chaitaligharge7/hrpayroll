import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ProjectsService } from './projects.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  standalone: false
})
export class ProjectsComponent implements OnInit {
  projects: any[] = [];
  filters = {
    status: '',
    project_manager_id: null
  };

  constructor(
    private projectsService: ProjectsService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.filters.status = '';
    this.loadProjects();

    // Auto refresh when navigating within projects routes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects || event.url;
        if (url.startsWith('/projects')) {
          if (!url.startsWith('/projects/create')) {
            // When returning to list, reset status filter and refresh
            this.filters.status = '';
            this.loadProjects();
          }
        }
      });
  }

  loadProjects(): void {
    const params = { ...this.filters };

    this.projectsService.getProjects(params).subscribe({
      next: (response) => {
        if (response.success) {
          this.projects = response.data || [];
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.cdr.detectChanges();
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

