import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DocumentsComponent } from './documents.component';

const routes: Routes = [{ path: '', component: DocumentsComponent }];

@NgModule({
  declarations: [DocumentsComponent],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)],
  providers: []
})
export class DocumentsModule {}
