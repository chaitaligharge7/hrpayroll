import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TrainingComponent } from './training.component';
import { TrainingService } from './training.service';
import { SharedModule } from '../../shared/shared.module';
import { TrainingProgramCreateComponent } from './training-program-create/training-program-create.component';
import { TrainingCourseCreateComponent } from './training-course-create/training-course-create.component';

const routes: Routes = [
  { path: '', component: TrainingComponent },
  { path: 'programs/create', component: TrainingProgramCreateComponent },
  { path: 'programs/edit/:id', component: TrainingProgramCreateComponent },
  { path: 'courses/create', component: TrainingCourseCreateComponent },
  { path: 'courses/edit/:id', component: TrainingCourseCreateComponent },
  { path: 'enroll', component: TrainingComponent }
];

@NgModule({
  declarations: [TrainingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    TrainingProgramCreateComponent,
    TrainingCourseCreateComponent
  ],
  providers: [TrainingService]
})
export class TrainingModule {}
