import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TrainingComponent } from './training.component';
import { TrainingService } from './training.service';
import { SharedModule } from '../../shared/shared.module';
import { RoutePlaceholderComponent } from '../../shared/route-placeholder/route-placeholder.component';

const routes: Routes = [
  { path: '', component: TrainingComponent },
  {
    path: 'programs/create',
    component: RoutePlaceholderComponent,
    data: { title: 'Create training program' }
  },
  {
    path: 'courses/create',
    component: RoutePlaceholderComponent,
    data: { title: 'Create course' }
  },
  {
    path: 'enroll',
    component: RoutePlaceholderComponent,
    data: { title: 'Enroll in training' }
  }
];

@NgModule({
  declarations: [TrainingComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
  providers: [TrainingService]
})
export class TrainingModule {}
