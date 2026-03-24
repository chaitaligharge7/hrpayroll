import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ComplianceComponent } from './compliance.component';

const routes: Routes = [{ path: '', component: ComplianceComponent }];

@NgModule({
  declarations: [ComplianceComponent],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)]
})
export class ComplianceModule {}
