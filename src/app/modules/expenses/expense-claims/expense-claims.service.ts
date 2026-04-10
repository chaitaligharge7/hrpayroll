import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseClaimsService {
  private readonly base = 'expenses/claims';

  constructor(private apiService: ApiService) {}

  getExpenseClaims(params: Record<string, unknown>): Observable<any> {
    const q: Record<string, string | number> = {};
    Object.keys(params).forEach((key) => {
      const v = params[key];
      if (v !== null && v !== undefined && v !== '') {
        q[key] = typeof v === 'number' ? v : String(v);
      }
    });
    return this.apiService.get(`${this.base}/list`, q);
  }

  getExpenseClaim(claimId: number): Observable<any> {
    return this.apiService.get(`${this.base}/get`, { id: claimId });
  }

  createExpenseClaim(data: unknown): Observable<any> {
    return this.apiService.post(`${this.base}/create`, data);
  }

  approveExpenseClaim(claimId: number, data: unknown): Observable<any> {
    return this.apiService.post(`${this.base}/approve?id=${claimId}`, data);
  }

  getCategories(): Observable<any> {
    return this.apiService.get('expenses/categories/list.php');
  }
}
