import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CandidatesService {
  private readonly base = 'recruitment/candidates';

  constructor(private apiService: ApiService) {}

  getCandidates(params: Record<string, unknown>): Observable<any> {
    const q: Record<string, string | number> = {};
    Object.keys(params).forEach((key) => {
      const v = params[key];
      if (v !== null && v !== undefined && v !== '') {
        q[key] = typeof v === 'number' ? v : String(v);
      }
    });
    return this.apiService.get(`${this.base}/list`, q);
  }

  getCandidate(candidateId: number): Observable<any> {
    return this.apiService.get(`${this.base}/get`, { id: candidateId });
  }

  createCandidate(data: unknown): Observable<any> {
    return this.apiService.post(`${this.base}/create`, data);
  }

  updateCandidate(candidateId: number, data: Record<string, unknown>): Observable<any> {
    return this.apiService.put(`${this.base}/update?id=${candidateId}`, data);
  }

  scheduleInterview(data: unknown): Observable<any> {
    return this.apiService.post('recruitment/interviews/schedule', data);
  }

  createOffer(data: unknown): Observable<any> {
    return this.apiService.post('recruitment/offers/create', data);
  }
}
