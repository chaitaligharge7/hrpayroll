import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ShiftsService {
  private readonly base = 'shifts';

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

  getRosters(params?: Record<string, unknown>): Observable<any> {
    return this.apiService.get(`${this.base}/rosters/list`, this.query(params));
  }

  createRoster(data: unknown): Observable<any> {
    return this.apiService.post(`${this.base}/rosters/create`, data);
  }

  getShiftSwaps(params?: Record<string, unknown>): Observable<any> {
    return this.apiService.get(`${this.base}/swaps/list`, this.query(params));
  }

  requestShiftSwap(data: unknown): Observable<any> {
    return this.apiService.post(`${this.base}/swaps/request`, data);
  }

  approveSwap(swapId: number, data: unknown): Observable<any> {
    return this.apiService.post(`${this.base}/swaps/approve?id=${swapId}`, data);
  }
}
