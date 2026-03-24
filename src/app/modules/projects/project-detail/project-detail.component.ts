import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from '../projects.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
  standalone: false
})
export class ProjectDetailComponent implements OnInit {
  project: any = null;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('projectId');
      if (!id) {
        this.router.navigate(['/projects']);
        return;
      }
      this.load(+id);
    });
  }

  load(projectId: number): void {
    this.loading = true;
    this.error = null;
    this.projectsService.getProject(projectId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.project = res.data;
        } else {
          this.error = res.message || 'Project not found';
        }
        this.loading = false;
      },
      error: (e) => {
        this.error = e?.message || 'Could not load project';
        this.loading = false;
      }
    });
  }

  back(): void {
    this.router.navigate(['/projects']);
  }
}
