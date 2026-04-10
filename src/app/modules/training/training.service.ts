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

  getProgram(id: number): Observable<any> {
    return this.apiService.get(`${this.base}/programs/get?id=${id}`);
  }

  createProgram(data: unknown): Observable<any> {
    return this.apiService.post(`${this.base}/programs/create`, data);
  }

  updateProgram(id: number, data: unknown): Observable<any> {
    return this.apiService.put(`${this.base}/programs/update?id=${id}`, data);
  }

  deleteProgram(id: number): Observable<any> {
    return this.apiService.delete(`${this.base}/programs/delete?id=${id}`);
  }

  getCourses(params?: Record<string, unknown>): Observable<any> {
    return this.apiService.get(`${this.base}/courses/list`, this.query(params));
  }

  getCourse(id: number): Observable<any> {
    return this.apiService.get(`${this.base}/courses/get?id=${id}`);
  }

  createCourse(data: unknown): Observable<any> {
    return this.apiService.post(`${this.base}/courses/create`, data);
  }

  updateCourse(id: number, data: unknown): Observable<any> {
    return this.apiService.put(`${this.base}/courses/update?id=${id}`, data);
  }

  deleteCourse(id: number): Observable<any> {
    return this.apiService.delete(`${this.base}/courses/delete?id=${id}`);
  }

  enroll(data: unknown): Observable<any> {
    return this.apiService.post(`${this.base}/enroll`, data);
  }

  getEnrollments(params?: Record<string, unknown>): Observable<any> {
    return this.apiService.get(`${this.base}/enrollments/list`, this.query(params));
  }

  createEnrollment(data: unknown): Observable<any> {
    return this.apiService.post(`${this.base}/enrollments/create`, data);
  }

  updateEnrollment(id: number, data: unknown): Observable<any> {
    return this.apiService.put(`${this.base}/enrollments/update?id=${id}`, data);
  }

  deleteEnrollment(id: number): Observable<any> {
    return this.apiService.delete(`${this.base}/enrollments/delete?id=${id}`);
  }

  completeEnrollment(enrollmentId: number, data: unknown): Observable<any> {
    return this.apiService.post(`${this.base}/enrollments/complete?id=${enrollmentId}`, data);
  }
}
