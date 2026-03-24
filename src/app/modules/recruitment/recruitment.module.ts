import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { JobPostingsComponent } from './job-postings/job-postings.component';
import { JobPostingFormComponent } from './job-postings/job-posting-form/job-posting-form.component';
import { JobPostingDetailComponent } from './job-postings/job-posting-detail/job-posting-detail.component';
import { CandidatesComponent } from './candidates/candidates.component';
import { CandidateFormComponent } from './candidates/candidate-form/candidate-form.component';
import { CandidateDetailComponent } from './candidates/candidate-detail/candidate-detail.component';
import { CandidateInterviewComponent } from './candidates/candidate-interview/candidate-interview.component';
import { CandidateOfferComponent } from './candidates/candidate-offer/candidate-offer.component';
import { JobPostingsService } from './job-postings/job-postings.service';
import { CandidatesService } from './candidates/candidates.service';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'job-postings' },
  { path: 'job-postings', component: JobPostingsComponent },
  {
    path: 'job-postings/create',
    component: JobPostingFormComponent
  },
  {
    path: 'job-postings/:jobId/edit',
    component: JobPostingFormComponent
  },
  {
    path: 'job-postings/:jobId',
    component: JobPostingDetailComponent
  },
  { path: 'candidates', component: CandidatesComponent },
  { path: 'candidates/create', component: CandidateFormComponent },
  {
    path: 'candidates/:candidateId/interview',
    component: CandidateInterviewComponent
  },
  {
    path: 'candidates/:candidateId/offer',
    component: CandidateOfferComponent
  },
  {
    path: 'candidates/:candidateId/edit',
    component: CandidateFormComponent
  },
  {
    path: 'candidates/:candidateId',
    component: CandidateDetailComponent
  }
];

@NgModule({
  declarations: [
    JobPostingsComponent,
    JobPostingFormComponent,
    JobPostingDetailComponent,
    CandidatesComponent,
    CandidateFormComponent,
    CandidateDetailComponent,
    CandidateInterviewComponent,
    CandidateOfferComponent
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule.forChild(routes), SharedModule],
  providers: [JobPostingsService, CandidatesService]
})
export class RecruitmentModule {}
