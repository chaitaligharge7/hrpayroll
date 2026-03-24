import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, ApiResponse } from '../../core/services/api.service';

export interface Employee {
  employee_id?: number;
  tenant_id?: number;
  employee_code: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  date_of_joining: string;
  department_id: number;
  designation_id: number;
  employment_status?: string;
  basic_salary?: number;
  official_email?: string;
  personal_phone?: string;
  department_name?: string;
  designation_name?: string;
}

export interface EmployeeListResponse {
  employees: Employee[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private api: ApiService) {}

  /**
   * Get employees list
   */
  getEmployees(params?: any): Observable<ApiResponse<EmployeeListResponse>> {
    return this.api.get<EmployeeListResponse>('employees/list', params);
  }

  /**
   * Get employee by ID
   */
  getEmployee(id: number): Observable<ApiResponse<Employee>> {
    return this.api.get<Employee>('employees/get', { id });
  }

  /**
   * Create employee
   */
  createEmployee(employee: Employee): Observable<ApiResponse<Employee>> {
    return this.api.post<Employee>('employees/create', employee);
  }

  /**
   * Update employee
   */
  updateEmployee(id: number, employee: Partial<Employee>): Observable<ApiResponse<Employee>> {
    return this.api.put<Employee>(`employees/update?id=${id}`, employee);
  }

  /**
   * Delete employee
   */
  deleteEmployee(id: number): Observable<ApiResponse<void>> {
    return this.api.delete<void>(`employees/delete?id=${id}`);
  }

  /**
   * Upload employee document
   */
  uploadDocument(employeeId: number, file: File, documentType: string): Observable<ApiResponse<any>> {
    return this.api.uploadFile(`employees/${employeeId}/upload-document`, file, {
      document_type: documentType
    });
  }
}

