import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-training-program-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './training-program-create.component.html',
  styleUrls: ['./training-program-create.component.scss']
})
export class TrainingProgramCreateComponent implements OnInit {
  form: any = {
    program_code: '',
    program_name: '',
    program_type: '',
    program_description: '',
    duration_hours: '',
    start_date: '',
    end_date: '',
    external_trainer: '',
    max_participants: '',
    location: '',
    cost_per_participant: '',
    total_budget: '',
    status: ''
  };

  isEditMode = false;
  programId: number | null = null;
  loading = false;
  loadingData = false;
  errorMessage = '';

  programTypes = ['Classroom', 'Online', 'Blended', 'On-the-Job', 'Workshop', 'Seminar'];
  statusOptions = ['Draft', 'Active', 'Completed', 'Cancelled'];

  constructor(
    private trainingService: TrainingService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.programId = +id;
      this.loadProgram();
    }
  }

  loadProgram(): void {
    this.loadingData = true;
    this.trainingService.getProgram(this.programId!).subscribe({
      next: (res: any) => {
        this.loadingData = false;
        if (res.success && res.data) {
          const p = res.data;
          this.form = {
            program_code: p.program_code || '',
            program_name: p.program_name || '',
            program_type: p.program_type || '',
            program_description: p.program_description || '',
            duration_hours: p.duration_hours || '',
            start_date: p.start_date ? p.start_date.substring(0, 10) : '',
            end_date: p.end_date ? p.end_date.substring(0, 10) : '',
            external_trainer: p.external_trainer || '',
            max_participants: p.max_participants || '',
            location: p.location || '',
            cost_per_participant: p.cost_per_participant || '',
            total_budget: p.total_budget || '',
            status: p.status || 'Draft'
          };
        } else {
          this.errorMessage = 'Program not found.';
        }
      },
      error: () => {
        this.loadingData = false;
        this.errorMessage = 'Failed to load program.';
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.form.program_code || !this.form.program_name) {
      this.errorMessage = 'Program code and name are required.';
      return;
    }

    this.loading = true;

    const payload: any = { ...this.form };

    if (this.isEditMode && this.programId) {
      this.trainingService.updateProgram(this.programId, payload).subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res.success) {
            this.router.navigate(['/training']);
          } else {
            this.errorMessage = res.message || 'Failed to update program.';
          }
        },
        error: (err: any) => {
          this.loading = false;
          this.errorMessage = err?.error?.message || 'An error occurred. Please try again.';
        }
      });
    } else {
      const createPayload: any = {};
      Object.keys(payload).forEach(key => {
        if (payload[key] !== '' && payload[key] !== null) {
          createPayload[key] = payload[key];
        }
      });
      this.trainingService.createProgram(createPayload).subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res.success) {
            this.router.navigate(['/training']);
          } else {
            this.errorMessage = res.message || 'Failed to create program.';
          }
        },
        error: (err: any) => {
          this.loading = false;
          this.errorMessage = err?.error?.message || 'An error occurred. Please try again.';
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/training']);
  }
}
