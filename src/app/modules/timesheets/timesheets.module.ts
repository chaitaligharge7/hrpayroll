import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { TimesheetsComponent } from './timesheets.component';
import { TimesheetsService } from './timesheets.service';

const routes: Routes = [{ path: '', component: TimesheetsComponent }];

@NgModule({
  declarations: [TimesheetsComponent],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)],
  providers: [TimesheetsService]
})
export class TimesheetsModule {}
