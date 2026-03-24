import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseClaimsService } from '../expense-claims.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-expense-claim-detail',
  templateUrl: './expense-claim-detail.component.html',
  styleUrls: ['./expense-claim-detail.component.scss'],
  standalone: false
})
export class ExpenseClaimDetailComponent implements OnInit {
  claim: any = null;
  loading = false;
  error: string | null = null;
  claimId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private expenseClaimsService: ExpenseClaimsService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('claimId');
      if (!id) {
        this.router.navigate(['/expenses/claims']);
        return;
      }
      this.claimId = +id;
      this.load(this.claimId);
    });
  }

  load(id: number): void {
    this.loading = true;
    this.error = null;
    this.expenseClaimsService.getExpenseClaim(id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.claim = res.data;
        } else {
          this.error = res.message || 'Claim not found';
        }
        this.loading = false;
      },
      error: (e) => {
        this.error = e?.message || 'Could not load claim';
        this.loading = false;
      }
    });
  }

  canApprove(): boolean {
    const u = this.auth.getCurrentUser();
    return !!u && ['super_admin', 'admin', 'hr'].includes(u.user_type);
  }

  approve(): void {
    if (!this.claimId) {
      return;
    }
    this.expenseClaimsService.approveExpenseClaim(this.claimId, { action: 'approve' }).subscribe({
      next: (res) => {
        if (res.success) {
          this.load(this.claimId!);
        }
      }
    });
  }

  reject(): void {
    const reason = prompt('Rejection reason?');
    if (!reason || !this.claimId) {
      return;
    }
    this.expenseClaimsService.approveExpenseClaim(this.claimId, { action: 'reject', rejection_reason: reason }).subscribe({
      next: (res) => {
        if (res.success) {
          this.load(this.claimId!);
        }
      }
    });
  }

  back(): void {
    this.router.navigate(['/expenses/claims']);
  }
}
