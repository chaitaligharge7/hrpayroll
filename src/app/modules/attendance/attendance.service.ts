import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, ApiResponse } from '../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
 getRegularization(): Observable<ApiResponse<any>> {
  return this.api.get<any>('attendance/get_regularization.php');
}
 requestRegularize(data: any): Observable<ApiResponse<any>> {
  return this.api.post<any>('attendance/regularize.php', data);
}
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

  regularize(data: any) {
  return this.api.post<any>('attendance/regularize.php', data);
}
approveRegularization(
  id: number,
  action: 'approve' | 'reject',
  rejection_reason?: string
) {
  return this.api.post<any>(
    `attendance/regularize/approve.php?id=${id}`,
    {
      action,
      rejection_reason
    }
  );
}

  getRules() {
    return this.api.get<any>('attendance/rules');
  }
}