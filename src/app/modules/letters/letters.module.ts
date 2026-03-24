import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { LettersComponent } from './letters.component';
import { LettersService } from './letters.service';

const routes: Routes = [{ path: '', component: LettersComponent }];

@NgModule({
  declarations: [LettersComponent],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)],
  providers: [LettersService]
})
export class LettersModule {}
