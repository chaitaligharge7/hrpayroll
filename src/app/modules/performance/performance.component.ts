import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PerformanceService } from './performance.service';

@Component({
  selector: 'app-performance',
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.scss'],
  standalone: false
})
export class PerformanceComponent implements OnInit {
  appraisals: any[] = [];
  cycles: any[] = [];
  loading = false;
  activeTab = 'appraisals';

  constructor(
    private performanceService: PerformanceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAppraisals();
    this.loadCycles();
  }

  loadAppraisals(): void {
    this.loading = true;
    this.performanceService.getAppraisals().subscribe({
      next: (response) => {
        if (response.success) {
          this.appraisals = response.data || [];
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading appraisals:', error);
        this.loading = false;
      }
    });
  }

  loadCycles(): void {
    this.performanceService.getCycles().subscribe({
      next: (response) => {
        if (response.success) {
          this.cycles = response.data || [];
        }
      },
      error: (error) => {
        console.error('Error loading cycles:', error);
      }
    });
  }

  createAppraisal(): void {
    this.router.navigate(['/performance/appraisals/create']);
  }

  createCycle(): void {
    this.router.navigate(['/performance/cycles/create']);
  }

  viewAppraisal(appraisalId: number): void {
    this.router.navigate(['/performance/appraisals', appraisalId]);
  }
}

