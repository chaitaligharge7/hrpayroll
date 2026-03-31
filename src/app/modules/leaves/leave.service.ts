import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, ApiResponse } from '../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  constructor(private api: ApiService) {}

  getLeaveBalance(employeeId?: number, year?: number): Observable<ApiResponse<any>> {
    const params: any = {};
    if (employeeId) params.employee_id = employeeId;
    if (year) params.year = year;
    return this.api.get<any>('leaves/balance', params);
  }

  getLeaveTypes(): Observable<ApiResponse<any>> {
    return this.api.get<any>('leaves/types');
  }

  getLeaveRequests(params?: any): Observable<ApiResponse<any>> {
    return this.api.get<any>('leaves/list', params);
  }

  applyLeave(leaveData: any): Observable<ApiResponse<any>> {
    return this.api.post<any>('leaves/apply', leaveData);
  }

  approveLeave(leaveRequestId: number, action: 'approve' | 'reject', reason?: string): Observable<ApiResponse<any>> {
    return this.api.post<any>(`leaves/approve?id=${leaveRequestId}`, {
      action,
      rejection_reason: reason
    });
  }
}