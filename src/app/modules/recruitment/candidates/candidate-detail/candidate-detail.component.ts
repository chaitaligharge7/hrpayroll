import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidatesService } from '../candidates.service';

@Component({
  selector: 'app-candidate-detail',
  templateUrl: './candidate-detail.component.html',
  styleUrls: ['./candidate-detail.component.scss'],
  standalone: false
})
export class CandidateDetailComponent implements OnInit {
  candidate: any = null;
  loading = false;
  error: string | null = null;
  candidateId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private candidatesService: CandidatesService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('candidateId');
      if (!id) {
        this.router.navigate(['/recruitment/candidates']);
        return;
      }
      this.candidateId = +id;
      this.load(this.candidateId);
    });
  }

  load(id: number): void {
    this.loading = true;
    this.error = null;
    this.candidatesService.getCandidate(id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.candidate = res.data;
        } else {
          this.error = res.message || 'Not found';
        }
        this.loading = false;
      },
      error: (e) => {
        this.error = e?.message || 'Could not load candidate';
        this.loading = false;
      }
    });
  }

  edit(): void {
    if (this.candidateId) {
      this.router.navigate(['/recruitment/candidates', this.candidateId, 'edit']);
    }
  }

  interview(): void {
    if (this.candidateId) {
      this.router.navigate(['/recruitment/candidates', this.candidateId, 'interview']);
    }
  }

  offer(): void {
    if (this.candidateId) {
      this.router.navigate(['/recruitment/candidates', this.candidateId, 'offer']);
    }
  }

  back(): void {
    this.router.navigate(['/recruitment/candidates']);
  }
}
