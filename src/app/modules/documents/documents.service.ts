import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  private readonly base = 'documents';

  constructor(private apiService: ApiService) {}

  getDocuments(params?: any): Observable<any> {
    const query: Record<string, string | number> = {};
    if (params) {
      Object.keys(params).forEach((key) => {
        const v = params[key];
        if (v !== null && v !== undefined && v !== '') {
          query[key] = v;
        }
      });
    }
    return this.apiService.get(`${this.base}/list`, query);
  }

  uploadDocument(data: FormData): Observable<any> {
    return this.apiService.post(`${this.base}/upload`, data);
  }

  downloadDocument(documentPath: string): Observable<any> {
    return this.apiService.get(`${this.base}/download`, { path: documentPath });
  }

  deleteDocument(documentId: number): Observable<any> {
    return this.apiService.delete(`${this.base}/delete?id=${documentId}`);
  }
}

