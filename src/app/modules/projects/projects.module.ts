import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { ProjectsComponent } from "./projects.component";
import { ProjectFormComponent } from "./project-form/project-form.component";
import { ProjectDetailComponent } from "./project-detail/project-detail.component";
import { ProjectsService } from "./projects.service";
import { SharedModule } from "../../shared/shared.module";

const routes: Routes = [
  { path: "", component: ProjectsComponent },
  { path: "create", component: ProjectFormComponent },
  { path: ":projectId/edit", component: ProjectFormComponent },
  { path: ":projectId", component: ProjectDetailComponent },
];

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectFormComponent,
    ProjectDetailComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  providers: [ProjectsService],
})
export class ProjectsModule {}
