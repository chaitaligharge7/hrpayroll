import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class JobPostingsService {
  private readonly base = 'recruitment/job-postings';

  constructor(private apiService: ApiService) {}

  getJobPostings(params: Record<string, string | number | null | undefined>): Observable<any> {
    const query: Record<string, string | number> = {};
    Object.keys(params).forEach((key) => {
      const v = params[key];
      if (v !== null && v !== undefined && v !== '') {
        query[key] = v as string | number;
      }
    });
    return this.apiService.get(`${this.base}/list`, query);
  }

  getJobPosting(jobId: number): Observable<any> {
    return this.apiService.get(`${this.base}/get`, { id: jobId });
  }

  createJobPosting(data: Record<string, unknown>): Observable<any> {
    return this.apiService.post(`${this.base}/create`, data);
  }

  updateJobPosting(jobId: number, data: Record<string, unknown>): Observable<any> {
    return this.apiService.put(`${this.base}/update?id=${jobId}`, data);
  }

  deleteJobPosting(jobId: number): Observable<any> {
    return this.apiService.delete(`${this.base}/delete?id=${jobId}`);
  }
}
