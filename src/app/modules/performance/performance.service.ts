import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private readonly base = 'performance';

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

  getAppraisals(params?: Record<string, unknown>): Observable<any> {
    return this.apiService.get(`${this.base}/appraisals/list`, this.query(params));
  }

  getAppraisal(appraisalId: number): Observable<any> {
    return this.apiService.get(`${this.base}/appraisals/get`, { id: appraisalId });
  }

  createAppraisal(data: unknown): Observable<any> {
    return this.apiService.post(`${this.base}/appraisals/create`, data);
  }

  submitAppraisal(appraisalId: number, data: unknown): Observable<any> {
    return this.apiService.post(`${this.base}/appraisals/submit?id=${appraisalId}`, data);
  }

  getCycles(): Observable<any> {
    return this.apiService.get(`${this.base}/cycles/list`);
  }

  createCycle(data: unknown): Observable<any> {
    return this.apiService.post(`${this.base}/cycles/create`, data);
  }

  submitFeedback(data: unknown): Observable<any> {
    return this.apiService.post(`${this.base}/feedback/submit`, data);
  }
}
