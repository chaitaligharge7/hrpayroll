import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "../../core/services/api.service";

@Injectable({
  providedIn: "root",
})
export class DesignationsService {
  constructor(private apiService: ApiService) {}
  getDesignations(params?: Record<string, any>): Observable<any> {
    const query: Record<string, any> = {};

    if (params) {
      Object.keys(params).forEach((key) => {
        const value = params[key];
        if (value !== null && value !== undefined && value !== "") {
          query[key] = value;
        }
      });
    }

    return this.apiService.get("designations/list", query);
  }

  createDesignation(data: any): Observable<any> {
    return this.apiService.post("designations/create.php", data);
  }

  deleteDesignation(id: number) {
    return this.apiService.post(`designations/delete.php?id=${id}`, {});
  }

  updateDesignation(id: number, data: any) {
    return this.apiService.post(`designations/update.php?id=${id}`, data);
  }
}
