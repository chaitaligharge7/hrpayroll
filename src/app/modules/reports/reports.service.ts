import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private readonly base = 'reports';

  constructor(private apiService: ApiService) {}

  generateReport(params: unknown): Observable<any> {
    return this.apiService.post(`${this.base}/generate`, params);
  }
}
