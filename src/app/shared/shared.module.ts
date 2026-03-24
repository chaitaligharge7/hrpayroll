import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RoutePlaceholderComponent } from './route-placeholder/route-placeholder.component';

@NgModule({
  declarations: [RoutePlaceholderComponent],
  imports: [CommonModule, RouterModule],
  exports: [CommonModule, RouterModule, RoutePlaceholderComponent]
})
export class SharedModule {}
