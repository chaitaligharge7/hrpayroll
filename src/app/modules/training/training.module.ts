import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TrainingComponent } from './training.component';
import { TrainingService } from './training.service';
import { SharedModule } from '../../shared/shared.module';
import { TrainingProgramCreateComponent } from './training-program-create/training-program-create.component';
import { TrainingCourseCreateComponent } from './training-course-create/training-course-create.component';
import { TrainingEnrollmentCreateComponent } from './training-enrollment-create/training-enrollment-create.component';
import { TrainingEnrollmentDetailComponent } from './training-enrollment-detail/training-enrollment-detail.component';

const routes: Routes = [
  { path: '', component: TrainingComponent },
  { path: 'programs/create', component: TrainingProgramCreateComponent },
  { path: 'programs/edit/:id', component: TrainingProgramCreateComponent },
  { path: 'courses/create', component: TrainingCourseCreateComponent },
  { path: 'courses/edit/:id', component: TrainingCourseCreateComponent },
  { path: 'enrollments/create', component: TrainingEnrollmentCreateComponent },
  { path: 'enrollments/view/:id', component: TrainingEnrollmentDetailComponent },
  { path: 'enrollments/edit/:id', component: TrainingEnrollmentCreateComponent },
  { path: 'enroll', component: TrainingComponent }
];

@NgModule({
  declarations: [TrainingComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule,
    TrainingProgramCreateComponent,
    TrainingCourseCreateComponent,
    TrainingEnrollmentCreateComponent,
    TrainingEnrollmentDetailComponent
  ],
  providers: [TrainingService]
})
export class TrainingModule {}
