import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { ExpenseClaimsComponent } from "./expense-claims/expense-claims.component";
import { ExpenseClaimFormComponent } from "./expense-claims/expense-claim-form/expense-claim-form.component";
import { ExpenseClaimDetailComponent } from "./expense-claims/expense-claim-detail/expense-claim-detail.component";
import { ExpenseClaimsService } from "./expense-claims/expense-claims.service";
import { SharedModule } from "../../shared/shared.module";
import { ExpenseCategoryList } from "./expense-category-list/expense-category-list";
import { ExpenseCategoryCreate } from "./expense-category-create/expense-category-create";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "claims" },
  { path: "claims", component: ExpenseClaimsComponent },
  { path: "claims/create", component: ExpenseClaimFormComponent },
  { path: "claims/:claimId", component: ExpenseClaimDetailComponent },
  { path: "expense-category", component: ExpenseCategoryList },
  { path: "expense-categoryCreate", component: ExpenseCategoryCreate },
];

@NgModule({
  declarations: [
    ExpenseClaimsComponent,
    ExpenseClaimFormComponent,
    ExpenseClaimDetailComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  providers: [ExpenseClaimsService],
})
export class ExpensesModule {}
