import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { PayrollListComponent } from './payroll-list/payroll-list.component';
import { PayrollService } from './payroll.service';

const routes: Routes = [{ path: '', component: PayrollListComponent }];

@NgModule({
  declarations: [PayrollListComponent],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)],
  providers: [PayrollService]
})
export class PayrollModule {}
