import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CandidatesService } from './candidates.service';

@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.scss'],
  standalone: false
})
export class CandidatesComponent implements OnInit {
  candidates: any[] = [];
  loading = false;
  page = 1;
  limit = 20;
  total = 0;
  filters = {
    job_id: null,
    status: '',
    search: ''
  };

  constructor(
    private candidatesService: CandidatesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCandidates();
  }

  loadCandidates(): void {
    this.loading = true;
    const params = {
      page: this.page,
      limit: this.limit,
      ...this.filters
    };

    this.candidatesService.getCandidates(params).subscribe({
      next: (response) => {
        if (response.success) {
          this.candidates = response.data.candidates || [];
          this.total = response.data.pagination?.total || 0;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading candidates:', error);
        this.loading = false;
      }
    });
  }

  addCandidate(): void {
    this.router.navigate(['/recruitment/candidates/create']);
  }

  viewCandidate(candidateId: number): void {
    this.router.navigate(['/recruitment/candidates', candidateId]);
  }

  scheduleInterview(candidateId: number): void {
    this.router.navigate(['/recruitment/candidates', candidateId, 'interview']);
  }

  createOffer(candidateId: number): void {
    this.router.navigate(['/recruitment/candidates', candidateId, 'offer']);
  }

  onFilterChange(): void {
    this.page = 1;
    this.loadCandidates();
  }

  onPageChange(page: number): void {
    this.page = page;
    this.loadCandidates();
  }

  getTotalPages(): number {
    return Math.ceil(this.total / this.limit);
  }

  getMath(): typeof Math {
    return Math;
  }
}

