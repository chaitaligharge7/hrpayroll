import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private readonly base = 'projects';

  constructor(private apiService: ApiService) {}

  getProjects(params: Record<string, unknown>): Observable<any> {
    const q: Record<string, string | number> = {};
    Object.keys(params).forEach((key) => {
      const v = params[key];
      if (v !== null && v !== undefined && v !== '') {
        q[key] = typeof v === 'number' ? v : String(v);
      }
    });
    return this.apiService.get(`${this.base}/list`, q);
  }

  getProject(projectId: number): Observable<any> {
    return this.apiService.get(`${this.base}/get`, { id: projectId });
  }

  createProject(data: unknown): Observable<any> {
    return this.apiService.post(`${this.base}/create`, data);
  }

  createTask(projectId: number, data: Record<string, unknown>): Observable<any> {
    return this.apiService.post(`${this.base}/tasks/create`, { project_id: projectId, ...data });
  }

  updateProject(projectId: number, payload: any) {
  return this.apiService.post(`projects/update?id=${projectId}`, payload);
}

 // ✅ NEW: Soft Delete Project
  // ✅ Soft Delete Project
deleteProject(projectId: number): Observable<any> {
  return this.apiService.delete(`${this.base}/delete?id=${projectId}`);
}
}