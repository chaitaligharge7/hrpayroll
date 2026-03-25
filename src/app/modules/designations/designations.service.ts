import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "../../core/services/api.service";

@Injectable({
  providedIn: "root",
})
export class DesignationsService {
  constructor(private apiService: ApiService) {}
  // ✅ NEW: Get Designations List (with optional department filter)
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

  // ✅ NEW: Create Designation
  createDesignation(data: any): Observable<any> {
    return this.apiService.post("designations/create.php", data);
  }
}
