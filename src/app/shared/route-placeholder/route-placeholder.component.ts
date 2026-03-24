import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-route-placeholder',
  template: `
    <div class="container py-4">
      <h4 class="mb-3">{{ title }}</h4>
      <p class="text-muted mb-4">
        This route is reserved for a detailed workflow. Use the main list or the API until the full UI is implemented.
      </p>
      <a [routerLink]="['..']" [relativeTo]="route" class="btn btn-outline-secondary btn-sm">Back</a>
    </div>
  `,
  styles: [``],
  standalone: false
})
export class RoutePlaceholderComponent {
  title = 'Page';

  constructor(public route: ActivatedRoute) {
    const data = route.snapshot.data;
    this.title = (data && (data['title'] as string)) || 'Page';
  }
}
