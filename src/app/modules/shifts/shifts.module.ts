import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ShiftsComponent } from './shifts.component';
import { ShiftsService } from './shifts.service';
import { SharedModule } from '../../shared/shared.module';
import { RoutePlaceholderComponent } from '../../shared/route-placeholder/route-placeholder.component';

const routes: Routes = [
  { path: '', component: ShiftsComponent },
  {
    path: 'rosters/create',
    component: RoutePlaceholderComponent,
    data: { title: 'Create shift roster' }
  },
  {
    path: 'swaps/request',
    component: RoutePlaceholderComponent,
    data: { title: 'Request shift swap' }
  }
];

@NgModule({
  declarations: [ShiftsComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
  providers: [ShiftsService]
})
export class ShiftsModule {}
