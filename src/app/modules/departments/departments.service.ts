import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "../../core/services/api.service";

@Injectable({
  providedIn: "root",
})
export class DepartmentsService {
  constructor(private apiService: ApiService) {}

  getDepartments(
    params?: Record<string, string | number | null | undefined>,
  ): Observable<any> {
    const query: Record<string, string | number> = {};
    if (params) {
      Object.keys(params).forEach((key) => {
        const v = params[key];
        if (v !== null && v !== undefined && v !== "") {
          query[key] = v as string | number;
        }
      });
    }
    return this.apiService.get("departments/list", query);
  }
  createDepartment(data: any): Observable<any> {
    // ✅ NEW
    return this.apiService.post("departments/create.php", data);
  }
}
