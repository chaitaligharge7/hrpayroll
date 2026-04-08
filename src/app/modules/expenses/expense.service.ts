import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  // Only endpoint path (ApiService adds base URL)
  private basePath = 'expenses/categories';

  constructor(private apiService: ApiService) {}

  /**
   * Get Expense Categories
   */
  getCategories(params?: any): Observable<any> {
    return this.apiService.get(
      `${this.basePath}/list.php`,
      params
    );
  }

  /**
   * Get single Expense Category by ID
   */
  getCategoryById(id: number): Observable<any> {
    return this.apiService.get(`${this.basePath}/get.php`, { id });
  }

  /**
   * Create Expense Category
   */
  createCategory(payload: any): Observable<any> {
    return this.apiService.post(
      `${this.basePath}/create.php`,
      payload
    );
  }

  /**
   * Update Expense Category
   */
  updateCategory(id: number, payload: any): Observable<any> {
    return this.apiService.put(`${this.basePath}/update.php?id=${id}`, payload);
  }

  /**
   * Soft-delete Expense Category
   */
  deleteCategory(id: number): Observable<any> {
    return this.apiService.delete(`${this.basePath}/delete.php?id=${id}`);
  }

}