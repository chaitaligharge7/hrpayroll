import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PerformanceComponent } from './performance.component';
import { PerformanceService } from './performance.service';
import { SharedModule } from '../../shared/shared.module';
import { RoutePlaceholderComponent } from '../../shared/route-placeholder/route-placeholder.component';

const routes: Routes = [
  { path: '', component: PerformanceComponent },
  {
    path: 'appraisals/create',
    component: RoutePlaceholderComponent,
    data: { title: 'Create appraisal' }
  },
  {
    path: 'cycles/create',
    component: RoutePlaceholderComponent,
    data: { title: 'Create performance cycle' }
  },
  {
    path: 'appraisals/:appraisalId',
    component: RoutePlaceholderComponent,
    data: { title: 'Appraisal detail' }
  }
];

@NgModule({
  declarations: [PerformanceComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
  providers: [PerformanceService]
})
export class PerformanceModule {}
