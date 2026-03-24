import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, ApiResponse } from '../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private api: ApiService) {}

  getDashboardData(): Observable<ApiResponse<any>> {
    return this.api.get<any>('dashboard/data');
  }
}

