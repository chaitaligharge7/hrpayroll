import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
  timestamp?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost/teamshr/php_backend/api/v1';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Get request.
   * Accepts a flat query object, or legacy `{ params: HttpParams | Record<string, unknown> }`.
   */
  get<T>(endpoint: string, params?: any): Observable<ApiResponse<T>> {
    let httpParams = new HttpParams();
    if (params) {
      if (
        typeof params === 'object' &&
        'params' in params &&
        Object.keys(params).length === 1
      ) {
        const inner = params.params;
        if (inner instanceof HttpParams) {
          httpParams = inner;
        } else if (inner && typeof inner === 'object') {
          Object.keys(inner).forEach((key) => {
            const val = inner[key];
            if (val !== null && val !== undefined && val !== '') {
              httpParams = httpParams.append(key, String(val));
            }
          });
        }
      } else {
        Object.keys(params).forEach((key) => {
          const val = params[key];
          if (val !== null && val !== undefined && val !== '') {
            httpParams = httpParams.append(key, String(val));
          }
        });
      }
    }

    const url = endpoint.startsWith('/') ? `${this.apiUrl}${endpoint}` : `${this.apiUrl}/${endpoint}`;
    return this.http.get<ApiResponse<T>>(url, {
      headers: this.getHeaders(),
      params: httpParams
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Post request
   */
  post<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    const url = endpoint.startsWith('/') ? `${this.apiUrl}${endpoint}` : `${this.apiUrl}/${endpoint}`;
    return this.http.post<ApiResponse<T>>(url, data, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Put request
   */
  put<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    const url = endpoint.startsWith('/') ? `${this.apiUrl}${endpoint}` : `${this.apiUrl}/${endpoint}`;
    return this.http.put<ApiResponse<T>>(url, data, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Delete request
   */
  delete<T>(endpoint: string): Observable<ApiResponse<T>> {
    const url = endpoint.startsWith('/') ? `${this.apiUrl}${endpoint}` : `${this.apiUrl}/${endpoint}`;
    return this.http.delete<ApiResponse<T>>(url, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Upload file
   */
  uploadFile(endpoint: string, file: File, additionalData?: any): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    const headers = this.getHeaders();
    headers.delete('Content-Type'); // Let browser set it for FormData

    const url = endpoint.startsWith('/') ? `${this.apiUrl}${endpoint}` : `${this.apiUrl}/${endpoint}`;
    return this.http.post<ApiResponse>(url, formData, {
      headers: headers
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get headers with auth token
   */
  private getHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const token = this.authService.getToken();
    if (token) {
      return headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * Handle errors
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
    }

    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}

