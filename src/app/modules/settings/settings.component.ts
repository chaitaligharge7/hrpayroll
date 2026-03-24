import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: false
})
export class SettingsComponent implements OnInit {
  grouped: Record<string, any[]> = {};
  loading = false;
  error: string | null = null;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;
    this.api.get<Record<string, any[]>>('settings/get').subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.grouped = res.data;
        } else {
          this.error = res.message || 'Could not load settings';
        }
        this.loading = false;
      },
      error: (e) => {
        this.error = e?.message || 'Could not load settings';
        this.loading = false;
      }
    });
  }

  categoryKeys(): string[] {
    return Object.keys(this.grouped || {});
  }

  keysFor(category: string): string[] {
    const block = this.grouped[category];
    return block && typeof block === 'object' ? Object.keys(block) : [];
  }

  valueAt(category: string, key: string): unknown {
    const block = this.grouped[category];
    if (!block || typeof block !== 'object' || Array.isArray(block)) {
      return null;
    }
    return (block as unknown as Record<string, unknown>)[key];
  }
}
