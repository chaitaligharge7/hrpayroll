import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidatesService } from '../candidates.service';
import { EmployeeService } from '../../../employees/employee.service';

@Component({
  selector: 'app-candidate-interview',
  templateUrl: './candidate-interview.component.html',
  styleUrls: ['./candidate-interview.component.scss'],
  standalone: false
})
export class CandidateInterviewComponent implements OnInit {
  candidateId: number | null = null;
  candidateName = '';
  scheduledAt = '';
  interviewType = '';
  interviewLocation = '';
  selectedInterviewers: number[] = [];
  employees: any[] = [];
  loading = false;
  saving = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private candidatesService: CandidatesService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('candidateId');
    if (!id) {
      this.router.navigate(['/recruitment/candidates']);
      return;
    }
    this.candidateId = +id;
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    this.scheduledAt = now.toISOString().slice(0, 16);

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

    this.employeeService.getEmployees({ page: 1, limit: 500, employment_status: 'Active' }).subscribe({
      next: (res) => {
        if (res.success && res.data?.employees) {
          this.employees = res.data.employees;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  toggleInterviewer(id: number, checked: boolean): void {
    if (checked) {
      if (!this.selectedInterviewers.includes(id)) {
        this.selectedInterviewers = [...this.selectedInterviewers, id];
      }
    } else {
      this.selectedInterviewers = this.selectedInterviewers.filter((x) => x !== id);
    }
  }

  isSelected(id: number): boolean {
    return this.selectedInterviewers.includes(id);
  }

  submit(): void {
    this.error = null;
    if (!this.candidateId || !this.scheduledAt || this.selectedInterviewers.length === 0) {
      this.error = 'Date/time and at least one interviewer are required.';
      return;
    }
    const scheduled_date = this.scheduledAt.replace('T', ' ') + ':00';
    const payload: Record<string, unknown> = {
      candidate_id: this.candidateId,
      scheduled_date,
      interviewer_ids: this.selectedInterviewers
    };
    if (this.interviewType.trim()) {
      payload['interview_type'] = this.interviewType.trim();
    }
    if (this.interviewLocation.trim()) {
      payload['interview_location'] = this.interviewLocation.trim();
    }
    this.saving = true;
    this.candidatesService.scheduleInterview(payload).subscribe({
      next: (res) => {
        this.saving = false;
        if (res.success) {
          this.router.navigate(['/recruitment/candidates', this.candidateId]);
        } else {
          this.error = res.message || 'Could not schedule';
        }
      },
      error: (e) => {
        this.saving = false;
        this.error = e?.message || 'Could not schedule';
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
