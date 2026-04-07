import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, ApiResponse } from '../../core/services/api.service';

export interface PayrollPeriod {
  period_id: number;
  period_code: string;
  period_name: string;
  start_date: string;
  end_date: string;
  pay_date: string;
  status: string;
}

export interface Payroll {
  payroll_id: number;
  employee_id: number;
  employee_code: string;
  employee_name: string;
  gross_salary: number;
  total_deductions: number;
  net_salary: number;
  status: string;
}

export interface Employee {
  employee_id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  employee_code: string;
  department_name: string;
  designation_name: string;
}

@Injectable({
  providedIn: 'root'
})
export class PayrollService {
  constructor(private api: ApiService) {}

  getPeriods(year?: number): Observable<ApiResponse<PayrollPeriod[]>> {
    const params = year ? { year } : {};
    return this.api.get<PayrollPeriod[]>('payroll/periods', params);
  }

  addPeriod(period: any): Observable<ApiResponse<PayrollPeriod>> {
    return this.api.post<PayrollPeriod>('payroll/periods', period);
  }

  getEmployeesList(): Observable<ApiResponse<Employee[]>> {
    return this.api.get<Employee[]>('employees/list'); // adjust endpoint
  }

  getPayrollList(params?: { period_id?: number; status?: string; page?: number; limit?: number }): Observable<ApiResponse<any>> {
    return this.api.get<any>('payroll/list', params);
  }

  createPayroll(payroll: any): Observable<ApiResponse<any>> {
    return this.api.post<any>('payroll/create', payroll); // adjust endpoint
  }

  processPayroll(periodId: number, employeeIds?: number[]): Observable<ApiResponse<any>> {
    return this.api.post<any>('payroll/process', {
      period_id: periodId,
      employee_ids: employeeIds
    });
  }

  approvePayroll(payrollIds: number[]): Observable<ApiResponse<any>> {
    return this.api.post<any>('payroll/approve', { payroll_ids: payrollIds });
  }

  generatePayroll(periodId: number): Observable<ApiResponse<any>> {
    return this.api.post<any>('payroll/generate_payroll', { period_id: periodId });
  }

  generateBankSheet(periodId: number, bankName?: string): Observable<ApiResponse<any>> {
    return this.api.post<any>('payroll/bank-sheet', { period_id: periodId, bank_name: bankName });
  }

  generatePayslip(payrollId: number): Observable<ApiResponse<any>> {
    return this.api.get<any>(`payroll/payslip?id=${payrollId}`);
  }
}