import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssetsService } from './assets.service';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss'],
  standalone: false
})
export class AssetsComponent implements OnInit {
  assets: any[] = [];
  loading = false;
  page = 1;
  limit = 20;
  total = 0;
  filters = {
    status: '',
    category_id: null,
    assigned_to: null
  };

  constructor(
    private assetsService: AssetsService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAssets();
  }

  loadAssets(): void {
    this.loading = true;
    const params = {
      page: this.page,
      limit: this.limit,
      ...this.filters
    };

    this.assetsService.getAssets(params).subscribe({
      next: (response) => {
        if (response.success) {
          this.assets = response.data.assets || [];
          this.total = response.data.pagination?.total || 0;
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading assets:', error);
        this.loading = false;
      }
    });
  }

  issueAsset(assetId: number): void {
    this.router.navigate(['/assets', assetId, 'issue']);
  }

  returnAsset(assetId: number): void {
    if (confirm('Are you sure you want to return this asset?')) {
      this.assetsService.returnAsset(assetId).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadAssets();
          }
        },
        error: (error) => {
          console.error('Error returning asset:', error);
        }
      });
    }
  }

  onFilterChange(): void {
    this.page = 1;
    this.loadAssets();
  }

  onPageChange(page: number): void {
    this.page = page;
    this.loadAssets();
  }

  createAsset(): void {
    this.router.navigate(['/assets/create']);
  }

  viewAsset(assetId: number): void {
    this.router.navigate(['/assets', assetId]);
  }

  getTotalPages(): number {
    return Math.ceil(this.total / this.limit);
  }

  getStatusClass(status: string): string {
    if (!status) return 'badge-secondary';
    switch (status.toLowerCase()) {
      case 'available':         return 'badge-approved';
      case 'issued':            return 'badge-info';
      case 'under maintenance': return 'badge-warning';
      case 'retired':           return 'badge-rejected';
      default:                  return 'badge-secondary';
    }
  }
}

