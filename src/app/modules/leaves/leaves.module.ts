import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { LeavesComponent } from './leaves.component';
import { LeaveService } from './leave.service';

const routes: Routes = [{ path: '', component: LeavesComponent }];

@NgModule({
  declarations: [LeavesComponent],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)],
  providers: [LeaveService]
})
export class LeavesModule {}
