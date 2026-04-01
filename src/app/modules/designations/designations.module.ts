import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DesignationListComponent } from './designation-list/designation-list';
import { CreateDesignation } from './create-designation/create-designation';
import { FormsModule } from '@angular/forms';


const routes: Routes = [
  { path: "", component:DesignationListComponent },
  { path: "create", component:CreateDesignation },
    { path: ":id/edit", component:CreateDesignation }
  
];

@NgModule({
  declarations: [],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)],
  providers: [],
})
export class DesignationsModule { }
