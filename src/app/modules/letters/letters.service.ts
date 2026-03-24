import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class LettersService {
  private readonly base = 'letters';

  constructor(private apiService: ApiService) {}

  getLetterTypes(): Observable<any> {
    return this.apiService.get(`${this.base}/types`);
  }

  generateLetter(params: unknown): Observable<any> {
    return this.apiService.post(`${this.base}/generate`, params);
  }

  downloadLetter(letterPath: string): Observable<any> {
    return this.apiService.get(`${this.base}/download`, { path: letterPath });
  }
}
