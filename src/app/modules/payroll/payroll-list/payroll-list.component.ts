import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PayrollService } from '../payroll.service';
import { Modal } from 'bootstrap'; 

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
  newPeriod: any = {};
  selectedPeriod: number | null = null;
  selectedStatus = '';
  selectedPayrolls: number[] = [];
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

  // Load payroll periods
  loadPeriods(): void {
    this.payrollService.getPeriods().subscribe({
      next: (response) => {
        if (response.success) {
          this.periods = response.data || [];
        }
      }
    });
  }

  // Load payrolls
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
        if (response?.success && response?.data) {
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

  // Filter change handlers
  onPeriodChange(): void {
    this.pagination.page = 1;
    this.loadPayrolls();
  }

  onStatusChange(): void {
    this.pagination.page = 1;
    this.loadPayrolls();
  }

  // Open Add Period modal
  openAddPeriodModal(): void {
    this.newPeriod = {}; 
    const modalEl = document.getElementById('addPeriodModal');
    if (modalEl) {
      const modal = new Modal(modalEl); 
      modal.show();
    }
  }

  // Add new payroll period
  addPeriod(): void {
    if (!this.newPeriod.period_name || !this.newPeriod.start_date || !this.newPeriod.end_date || !this.newPeriod.pay_date) {
      alert('Please fill all required fields.');
      return;
    }

    this.payrollService.addPeriod(this.newPeriod).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Payroll period added successfully!');
          const modalEl = document.getElementById('addPeriodModal');
          if (modalEl) {
            const modal = Modal.getInstance(modalEl) || new Modal(modalEl);
            modal.hide();
          }
          this.loadPeriods();
          this.newPeriod = {};
        } else {
          alert('Failed to add period.');
        }
      },
      error: (err) => {
        console.error(err);
        alert('Error occurred while adding period.');
      }
    });
  }

  // Generate bank sheet
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

  // Pagination controls
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

  // Select payrolls
  onPayrollSelect(payroll: any): void {
    if (payroll.selected) {
      if (!this.selectedPayrolls.includes(payroll.payroll_id)) {
        this.selectedPayrolls.push(payroll.payroll_id);
      }
    } else {
      this.selectedPayrolls = this.selectedPayrolls.filter(id => id !== payroll.payroll_id);
    }
  }

  toggleSelectAll(event: any): void {
    const checked = event.target.checked;
    this.selectedPayrolls = [];

    this.payrolls.forEach(p => {
      p.selected = checked;
      if (checked) this.selectedPayrolls.push(p.payroll_id);
    });
  }

  // View payslip
  viewPayslip(payroll: any): void {
    if (payroll.payslip_path) {
      window.open(payroll.payslip_path, '_blank');
    } else {
      alert('Payslip not generated yet.');
    }
  }


  generatePayroll(): void {
  if (!this.selectedPeriod) {
    alert('Please select a payroll period first.');
    return;
  }

  if (!confirm('Generate payroll for selected period?')) return;

  this.payrollService.generatePayroll(this.selectedPeriod).subscribe({
    next: (response) => {
      if (response.success) {
        alert('Payroll generated successfully!');
        this.loadPayrolls(); // refresh the list
      } else {
        alert('Failed to generate payroll.');
      }
    },
    error: (err) => {
      console.error(err);
      alert('Error generating payroll.');
    }
  });
}
  // Approve payrolls
  approvePayroll(selectedPayrolls: number[]): void {
    if (selectedPayrolls.length === 0) return;

    if (confirm('Are you sure you want to approve selected payrolls?')) {
      this.payrollService.approvePayroll(selectedPayrolls).subscribe({
        next: (res) => {
          if (res.success) {
            alert('Payrolls approved successfully');
            this.loadPayrolls();
            this.selectedPayrolls = [];
          }
        },
        error: (err) => {
          console.error(err);
          alert('Error approving payrolls');
        }
      });
    }
  }
}