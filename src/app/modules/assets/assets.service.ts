import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {
  private readonly base = 'assets';

  constructor(private apiService: ApiService) {}

  getAssets(params: Record<string, unknown>): Observable<any> {
    const q: Record<string, string | number> = {};
    Object.keys(params).forEach((key) => {
      const v = params[key];
      if (v !== null && v !== undefined && v !== '') {
        q[key] = typeof v === 'number' ? v : String(v);
      }
    });
    return this.apiService.get(`${this.base}/list`, q);
  }

  getAsset(assetId: number): Observable<any> {
    return this.apiService.get(`${this.base}/get`, { id: assetId });
  }

  issueAsset(assetId: number, data: unknown): Observable<any> {
    return this.apiService.post(`${this.base}/issue?id=${assetId}`, data);
  }

  returnAsset(assetId: number): Observable<any> {
    return this.apiService.post(`${this.base}/return?id=${assetId}`, {});
  }
}
