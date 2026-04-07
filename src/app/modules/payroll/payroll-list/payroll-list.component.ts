import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PayrollService } from '../payroll.service';
import { Modal } from 'bootstrap';
import { ChangeDetectorRef } from '@angular/core';

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

  constructor(private payrollService: PayrollService, private router: Router,private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadPeriods();
    this.loadPayrolls();
  }

  loadPeriods(): void {
    this.payrollService.getPeriods().subscribe({
      next: (res) => {
        if (res.success) this.periods = res.data || [];
      },
      error: (err) => console.error('Error loading periods', err)
    });
  }

  loadPayrolls(): void {
    this.loading = true;
    const params: any = { page: this.pagination.page, limit: this.pagination.limit };
    if (this.selectedPeriod) params.period_id = this.selectedPeriod;
    if (this.selectedStatus) params.status = this.selectedStatus;

    this.payrollService.getPayrollList(params).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.payrolls = res.data.payroll || [];
          this.pagination = res.data.pagination || this.pagination;
          this.summary = res.data.summary || this.summary;
        }
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  onPeriodChange(): void { this.pagination.page = 1; this.loadPayrolls(); }
  onStatusChange(): void { 
    this.pagination.page = 1; 
    this.loadPayrolls();
    this.cd.detectChanges(); }

  openAddPeriodModal(): void {
    this.newPeriod = {};
    const modalEl = document.getElementById('addPeriodModal');
    if (modalEl) new Modal(modalEl).show();
  }

  addPeriod(): void {
  if (!this.newPeriod.period_name || !this.newPeriod.start_date || !this.newPeriod.end_date || !this.newPeriod.pay_date) {
    alert('Please fill all required fields.');
    return;
  }

  this.payrollService.addPeriod(this.newPeriod).subscribe({
    next: (res) => {
      if (res.success) {
        alert('Payroll period added successfully!');
        const modalEl = document.getElementById('addPeriodModal');
        if (modalEl) {
          const modal = Modal.getOrCreateInstance(modalEl);
          modal.hide();
        }
        this.newPeriod = {};
        setTimeout(() => this.loadPeriods());
      } else alert('Failed to add period.');
    },
    error: (err) => { console.error(err); alert('Error occurred while adding period.'); }
  });
}

  generateBankSheet(): void {
    if (!this.selectedPeriod) { alert('Please select a payroll period'); return; }
    if (!confirm('Generate bank salary sheet for selected period?')) return;

    this.payrollService.generateBankSheet(this.selectedPeriod).subscribe({
      next: (res) => {
        if (res.success) {
          alert('Bank sheet generated successfully');
          if (res.data.download_url) window.open(res.data.download_url, '_blank');
        }
      },
      error: (err) => { console.error(err); alert('Error generating bank sheet'); }
    });
  }

generatePayroll(): void {
  if (!this.selectedPeriod) { alert('Select a period first'); return; }
  if (!confirm('Generate payroll for selected period?')) return;

  this.payrollService.generatePayroll(this.selectedPeriod).subscribe({
    next: (res) => {
      if (res.success) {
        alert('Payroll generated successfully!');
        // 🔹 immediately reload payrolls after generation
        this.loadPayrolls();
      } else alert('Failed to generate payroll.');
    },
    error: (err) => { console.error(err); alert('Error generating payroll'); }
  });
}


  loadPayroll(): void {
  this.loading = true;
  const params: any = { page: this.pagination.page, limit: this.pagination.limit };

  if (this.selectedPeriod) params.period_id = this.selectedPeriod;
  if (this.selectedStatus) params.status = this.selectedStatus; // 🔹 pass status to API

  this.payrollService.getPayrollList(params).subscribe({
    next: (res) => {
      if (res.success && res.data) {
        this.payrolls = [...(res.data.payroll || [])]; // new array triggers Angular update
        this.pagination = res.data.pagination || this.pagination;
        this.summary = res.data.summary || this.summary;
        this.cd.detectChanges(); // force view update
      }
      this.loading = false;
    },
    error: () => this.loading = false
  });
}
  approvePayroll(selectedPayrolls: number[]): void {
    if (!selectedPayrolls.length) return;
    if (!confirm('Approve selected payrolls?')) return;

    this.payrollService.approvePayroll(selectedPayrolls).subscribe({
      next: (res) => {
        if (res.success) {
          alert('Payrolls approved successfully');
          this.loadPayrolls();
          this.selectedPayrolls = [];
        }
      },
      error: (err) => { console.error(err); alert('Error approving payrolls'); }
    });
  }


  previousPage(): void { if (this.pagination.page > 1) { this.pagination.page--; this.loadPayrolls(); } }
  nextPage(): void { if (this.pagination.page < this.pagination.total_pages) { this.pagination.page++; this.loadPayrolls(); } }
  goToPage(page: number): void { this.pagination.page = page; this.loadPayrolls(); }
  getTotalPages(): number { return this.pagination.total_pages || Math.ceil(this.pagination.total / this.pagination.limit); }
  getMath(): typeof Math { return Math; }

  onPayrollSelect(payroll: any): void {
    if (payroll.selected) {
      if (!this.selectedPayrolls.includes(payroll.payroll_id)) this.selectedPayrolls.push(payroll.payroll_id);
    } else this.selectedPayrolls = this.selectedPayrolls.filter(id => id !== payroll.payroll_id);
  }

  toggleSelectAll(event: any): void {
    const checked = event.target.checked;
    this.selectedPayrolls = [];
    this.payrolls.forEach(p => { p.selected = checked; if (checked) this.selectedPayrolls.push(p.payroll_id); });
  }


  viewPayslip(payroll: any): void {
    if (payroll.payslip_path) window.open(payroll.payslip_path, '_blank');
    else alert('Payslip not generated yet.');
  }
}