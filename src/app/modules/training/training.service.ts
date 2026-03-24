import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private readonly base = 'training';

  constructor(private apiService: ApiService) {}

  private query(params?: Record<string, unknown>): Record<string, string | number> | undefined {
    if (!params) {
      return undefined;
    }
    const q: Record<string, string | number> = {};
    Object.keys(params).forEach((key) => {
      const v = params[key];
      if (v !== null && v !== undefined && v !== '') {
        q[key] = typeof v === 'number' ? v : String(v);
      }
    });
    return Object.keys(q).length ? q : undefined;
  }

  getPrograms(params?: Record<string, unknown>): Observable<any> {
    return this.apiService.get(`${this.base}/programs/list`, this.query(params));
  }

  createProgram(data: unknown): Observable<any> {
    return this.apiService.post(`${this.base}/programs/create`, data);
  }

  /** Courses list is a GET endpoint in PHP */
  getCourses(params?: Record<string, unknown>): Observable<any> {
    return this.apiService.get(`${this.base}/courses/list`, this.query(params));
  }

  createCourse(data: unknown): Observable<any> {
    return this.apiService.post(`${this.base}/courses/create`, data);
  }

  enroll(data: unknown): Observable<any> {
    return this.apiService.post(`${this.base}/enroll`, data);
  }

  getEnrollments(params?: Record<string, unknown>): Observable<any> {
    return this.apiService.get(`${this.base}/enrollments/list`, this.query(params));
  }

  completeEnrollment(enrollmentId: number, data: unknown): Observable<any> {
    return this.apiService.post(`${this.base}/enrollments/complete?id=${enrollmentId}`, data);
  }
}
