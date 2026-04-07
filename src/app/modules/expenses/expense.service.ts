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
   * Create Expense Category
   */
  createCategory(payload: any): Observable<any> {
    return this.apiService.post(
      `${this.basePath}/create.php`,
      payload
    );
  }

}