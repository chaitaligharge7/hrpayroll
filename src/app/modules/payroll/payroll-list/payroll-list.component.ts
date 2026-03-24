import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PayrollService } from '../payroll.service';

@Component({
  selector: 'app-payroll-list',
  templateUrl: './payroll-list.component.html',
  styleUrls: ['./payroll-list.component.scss'],
  standalone: false
})
export class PayrollListComponent implements OnInit {
  payrolls: any[] = [];
  periods: any[] = [];
  loading = false;
  
  selectedPeriod: number | null = null;
  selectedStatus = '';
  
  pagination = {
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0
  };

  summary: any = {
    total_gross: 0,
    total_deductions: 0,
    total_net: 0
  };

  constructor(
    private payrollService: PayrollService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPeriods();
    this.loadPayrolls();
  }

  loadPeriods(): void {
    this.payrollService.getPeriods().subscribe({
      next: (response) => {
        if (response.success) {
          this.periods = response.data || [];
        }
      }
    });
  }

  loadPayrolls(): void {
    this.loading = true;
    const params: any = {
      page: this.pagination.page,
      limit: this.pagination.limit
    };

    if (this.selectedPeriod) {
      params.period_id = this.selectedPeriod;
    }

    if (this.selectedStatus) {
      params.status = this.selectedStatus;
    }

    this.payrollService.getPayrollList(params).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.payrolls = response.data.payroll || [];
          this.pagination = response.data.pagination || this.pagination;
          this.summary = response.data.summary || this.summary;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onPeriodChange(): void {
    this.pagination.page = 1;
    this.loadPayrolls();
  }

  onStatusChange(): void {
    this.pagination.page = 1;
    this.loadPayrolls();
  }

  viewPayslip(payroll: any): void {
    this.payrollService.generatePayslip(payroll.payroll_id).subscribe({
      next: (response) => {
        if (response.success) {
          // Open payslip in new window or download
          window.open(response.data.download_url || '#', '_blank');
        }
      }
    });
  }

  approvePayroll(payrollIds: number[]): void {
    if (confirm('Are you sure you want to approve selected payrolls?')) {
      this.payrollService.approvePayroll(payrollIds).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadPayrolls();
          }
        }
      });
    }
  }

  generateBankSheet(): void {
    if (!this.selectedPeriod) {
      alert('Please select a payroll period');
      return;
    }

    if (confirm('Generate bank salary sheet for selected period?')) {
      this.payrollService.generateBankSheet(this.selectedPeriod).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Bank sheet generated successfully');
            if (response.data.download_url) {
              window.open(response.data.download_url, '_blank');
            }
          }
        }
      });
    }
  }

  previousPage(): void {
    if (this.pagination.page > 1) {
      this.pagination.page--;
      this.loadPayrolls();
    }
  }

  nextPage(): void {
    if (this.pagination.page < this.pagination.total_pages) {
      this.pagination.page++;
      this.loadPayrolls();
    }
  }

  goToPage(page: number): void {
    this.pagination.page = page;
    this.loadPayrolls();
  }

  getTotalPages(): number {
    return this.pagination.total_pages || Math.ceil(this.pagination.total / this.pagination.limit);
  }

  getMath(): typeof Math {
    return Math;
  }
}

