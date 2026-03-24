import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, ApiResponse } from '../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  constructor(private api: ApiService) {}

  checkIn(location?: string): Observable<ApiResponse<any>> {
    return this.api.post<any>('attendance/checkin', {
      location,
      method: 'Web'
    });
  }

  checkOut(location?: string): Observable<ApiResponse<any>> {
    return this.api.post<any>('attendance/checkout', {
      location,
      method: 'Web'
    });
  }

  getAttendanceList(params?: any): Observable<ApiResponse<any>> {
    return this.api.get<any>('attendance/list', params);
  }
}

