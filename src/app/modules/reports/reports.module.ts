import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { ReportsComponent } from './reports.component';
import { ReportsService } from './reports.service';

const routes: Routes = [{ path: '', component: ReportsComponent }];

@NgModule({
  declarations: [ReportsComponent],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)],
  providers: [ReportsService]
})
export class ReportsModule {}