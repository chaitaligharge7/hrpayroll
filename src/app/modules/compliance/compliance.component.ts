import { Component } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-compliance',
  templateUrl: './compliance.component.html',
  styleUrls: ['./compliance.component.scss'],
  standalone: false
})
export class ComplianceComponent {
  employeeIdGratuity: number | null = null;
  financialYear = '';
  bonusType = 'Statutory';
  bonusPercentage: number | null = null;
  message: string | null = null;
  result: unknown = null;

  constructor(private api: ApiService) {}

  calculateGratuity(): void {
    if (!this.employeeIdGratuity) {
      this.message = 'Employee ID is required';
      return;
    }
    this.message = null;
    this.result = null;
    this.api.post('compliance/gratuity/calculate', { employee_id: this.employeeIdGratuity }).subscribe({
      next: (res) => {
        this.message = res.message || (res.success ? 'OK' : 'Failed');
        if (res.success) {
          this.result = res.data;
        }
      },
      error: (e) => {
        this.message = e?.message || 'Request failed';
      }
    });
  }

  calculateBonus(): void {
    if (!this.financialYear?.trim()) {
      this.message = 'Financial year is required (e.g. 2024-25)';
      return;
    }
    this.message = null;
    this.result = null;
    const body: Record<string, unknown> = {
      financial_year: this.financialYear.trim(),
      bonus_type: this.bonusType
    };
    if (this.bonusPercentage != null && (this.bonusType === 'Performance' || this.bonusType === 'Annual')) {
      body['bonus_percentage'] = this.bonusPercentage;
    }
    this.api.post('compliance/bonus/calculate', body).subscribe({
      next: (res) => {
        this.message = res.message || (res.success ? 'OK' : 'Failed');
        if (res.success) {
          this.result = res.data;
        }
      },
      error: (e) => {
        this.message = e?.message || 'Request failed';
      }
    });
  }
}
