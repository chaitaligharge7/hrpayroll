import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidatesService } from '../candidates.service';
import { DepartmentsService } from '../../../departments/departments.service';

@Component({
  selector: 'app-candidate-offer',
  templateUrl: './candidate-offer.component.html',
  styleUrls: ['./candidate-offer.component.scss'],
  standalone: false
})
export class CandidateOfferComponent implements OnInit {
  candidateId: number | null = null;
  candidateName = '';
  offer_code = '';
  designation = '';
  joining_date = '';
  ctc: number | null = null;
  department_id: number | null = null;
  basic_salary: number | null = null;
  departments: any[] = [];
  loading = false;
  saving = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private candidatesService: CandidatesService,
    private departmentsService: DepartmentsService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('candidateId');
    if (!id) {
      this.router.navigate(['/recruitment/candidates']);
      return;
    }
    this.candidateId = +id;
    this.joining_date = new Date().toISOString().slice(0, 10);

    this.loading = true;
    this.candidatesService.getCandidate(this.candidateId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const c = res.data;
          this.candidateName = `${c.first_name} ${c.last_name}`;
        }
      },
      error: () => {}
    });
    this.departmentsService.getDepartments().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.departments = Array.isArray(res.data) ? res.data : [];
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  submit(): void {
    this.error = null;
    if (!this.candidateId || !this.offer_code.trim() || !this.designation.trim() || !this.joining_date || this.ctc == null) {
      this.error = 'Offer code, designation, joining date and CTC are required.';
      return;
    }
    const payload: Record<string, unknown> = {
      candidate_id: this.candidateId,
      offer_code: this.offer_code.trim(),
      designation: this.designation.trim(),
      joining_date: this.joining_date,
      ctc: +this.ctc
    };
    if (this.department_id) {
      payload['department_id'] = +this.department_id;
    }
    if (this.basic_salary != null) {
      payload['basic_salary'] = +this.basic_salary;
    }
    this.saving = true;
    this.candidatesService.createOffer(payload).subscribe({
      next: (res) => {
        this.saving = false;
        if (res.success) {
          this.router.navigate(['/recruitment/candidates', this.candidateId]);
        } else {
          this.error = res.message || 'Could not create offer';
        }
      },
      error: (e) => {
        this.saving = false;
        this.error = e?.message || 'Could not create offer';
      }
    });
  }

  cancel(): void {
    if (this.candidateId) {
      this.router.navigate(['/recruitment/candidates', this.candidateId]);
    } else {
      this.router.navigate(['/recruitment/candidates']);
    }
  }
}
