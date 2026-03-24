import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AttendanceComponent } from './attendance.component';
import { AttendanceService } from './attendance.service';

const routes: Routes = [{ path: '', component: AttendanceComponent }];

@NgModule({
  declarations: [AttendanceComponent],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)],
  providers: [AttendanceService]
})
export class AttendanceModule {}
