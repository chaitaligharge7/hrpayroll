import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AssetsComponent } from './assets.component';
import { AssetsService } from './assets.service';
import { SharedModule } from '../../shared/shared.module';
import { RoutePlaceholderComponent } from '../../shared/route-placeholder/route-placeholder.component';

const routes: Routes = [
  { path: '', component: AssetsComponent },
  {
    path: 'create',
    component: RoutePlaceholderComponent,
    data: { title: 'Create asset' }
  },
  {
    path: ':assetId/issue',
    component: RoutePlaceholderComponent,
    data: { title: 'Issue asset' }
  },
  {
    path: ':assetId',
    component: RoutePlaceholderComponent,
    data: { title: 'Asset detail' }
  }
];

@NgModule({
  declarations: [AssetsComponent],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes), SharedModule],
  providers: [AssetsService]
})
export class AssetsModule {}
