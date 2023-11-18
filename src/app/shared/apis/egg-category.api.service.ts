import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EggCategoryDto } from "generated-src/model";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class EggCategoryApiService {
  baseUrl = `${environment.apiPath}egg-categories/`;

  constructor(private http: HttpClient) { }

  public save(eggCategories: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, eggCategories, { responseType: 'text' });
  }

  public findAll(): Observable<EggCategoryDto[]> {
    return this.http.get<EggCategoryDto[]>(`${this.baseUrl}all`);
  }
}