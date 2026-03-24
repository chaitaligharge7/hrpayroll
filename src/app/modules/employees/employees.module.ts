import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { EmployeeLettersComponent } from './employee-detail/employee-letters.component';
import { EmployeeProfileComponent } from './employee-profile/employee-profile.component';
import { EmployeeService } from './employee.service';

const routes: Routes = [
  { path: '', component: EmployeeListComponent },
  { path: 'create', component: EmployeeFormComponent },
  { path: ':id/edit', component: EmployeeFormComponent },
  { path: ':id', component: EmployeeProfileComponent }
];

@NgModule({
  declarations: [
    EmployeeListComponent,
    EmployeeFormComponent,
    EmployeeLettersComponent,
    EmployeeProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [EmployeeService]
})
export class EmployeesModule {}
