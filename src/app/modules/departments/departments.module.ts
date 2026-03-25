import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { DepartmentListComponent } from "./department-list/department-list" 
import { CreateDepartment } from "./create-department/create-department";

const routes: Routes = [
  { path: "", component:DepartmentListComponent },
  { path: "create", component: CreateDepartment },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)],
  providers: [],
})
export class DepartmentModule {}
