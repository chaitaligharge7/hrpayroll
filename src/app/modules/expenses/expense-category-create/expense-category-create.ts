import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ExpenseService } from "../expense.service";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-expense-category-create",
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./expense-category-create.html",
  styleUrl: "./expense-category-create.scss",
})
export class ExpenseCategoryCreate implements OnInit {
  categoryForm!: FormGroup;
  loading: boolean = false;
  successMessage: string = "";
  errorMessage: string = "";

  // Edit mode
  isEditMode: boolean = false;
  categoryId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.initForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.categoryId = +id;
      this.loadCategory(this.categoryId);
    }
  }

  initForm() {
    this.categoryForm = this.fb.group({
      category_code: ["", Validators.required],
      category_name: ["", Validators.required],
      category_description: [""],
      is_taxable: [0],
      is_active: [1],
    });
  }

  loadCategory(id: number) {
    this.loading = true;
    this.expenseService.getCategoryById(id).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res && res.success && res.data) {
          this.categoryForm.patchValue(res.data);
          this.cdr.detectChanges();
        } else {
          this.errorMessage = res?.message || "Failed to load category";
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = "Failed to load category";
        console.error(err);
      },
    });
  }

  onSubmit() {
    this.successMessage = "";
    this.errorMessage = "";

    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const payload = this.categoryForm.value;

    if (this.isEditMode && this.categoryId) {
      this.expenseService.updateCategory(this.categoryId, payload).subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res && res.success) {
            this.router.navigate(["/expenses/expense-category"]);
          } else {
            this.errorMessage = res?.message || "Failed to update category";
            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.message || "Failed to update category";
          console.error(err);
        },
      });
    } else {
      this.expenseService.createCategory(payload).subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res && res.success) {
            this.successMessage = res.message || "Category created successfully";
            this.categoryForm.reset({ is_taxable: 0, is_active: 1 });
          } else {
            this.errorMessage = res?.message || "Failed to create category";
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.message || "Failed to create category";
          console.error(err);
        },
      });
    }
  }

  cancel(): void {
    this.router.navigate(["/expenses/expense-category"]);
  }
}
