import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TimesheetsService {
  private readonly base = 'timesheets';

  constructor(private apiService: ApiService) {}

  getTimesheets(params: Record<string, unknown>): Observable<any> {
    const q: Record<string, string | number> = {};
    Object.keys(params).forEach((key) => {
      const v = params[key];
      if (v !== null && v !== undefined && v !== '') {
        q[key] = typeof v === 'number' ? v : String(v);
      }
    });
    return this.apiService.get(`${this.base}/list`, q);
  }

  submitTimesheet(data: unknown): Observable<any> {
    return this.apiService.post(`${this.base}/submit`, data);
  }
}
