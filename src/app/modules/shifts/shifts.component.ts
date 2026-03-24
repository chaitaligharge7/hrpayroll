import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShiftsService } from './shifts.service';

@Component({
  selector: 'app-shifts',
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.scss'],
  standalone: false
})
export class ShiftsComponent implements OnInit {
  rosters: any[] = [];
  shiftSwaps: any[] = [];
  loading = false;
  activeTab = 'rosters';

  constructor(
    private shiftsService: ShiftsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRosters();
    this.loadShiftSwaps();
  }

  loadRosters(): void {
    this.loading = true;
    this.shiftsService.getRosters().subscribe({
      next: (response) => {
        if (response.success) {
          this.rosters = response.data || [];
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading rosters:', error);
        this.loading = false;
      }
    });
  }

  loadShiftSwaps(): void {
    this.shiftsService.getShiftSwaps().subscribe({
      next: (response) => {
        if (response.success) {
          this.shiftSwaps = response.data || [];
        }
      },
      error: (error) => {
        console.error('Error loading shift swaps:', error);
      }
    });
  }

  createRoster(): void {
    this.router.navigate(['/shifts/rosters/create']);
  }

  requestShiftSwap(): void {
    this.router.navigate(['/shifts/swaps/request']);
  }

  approveSwap(swapId: number): void {
    this.shiftsService.approveSwap(swapId, { action: 'approve' }).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadShiftSwaps();
        }
      },
      error: (error) => {
        console.error('Error approving swap:', error);
      }
    });
  }
}

