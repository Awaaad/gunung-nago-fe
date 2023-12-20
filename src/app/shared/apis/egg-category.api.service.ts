import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EggCategoryDto, EggCategoryStockDto } from "generated-src/model";
import { PageResult } from "generated-src/model-front";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class EggCategoryApiService {
  baseUrl = `${environment.apiPath}egg-categories`;

  constructor(private http: HttpClient) { }

  public save(eggCategories: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, eggCategories, { responseType: 'text' });
  }

  public search(searchValues: any): Observable<PageResult<EggCategoryDto>> {
    return this.http.get<PageResult<EggCategoryDto>>(`${this.baseUrl}/search`, { params: searchValues });
  }

  public searchEggCategoryStock(searchValues: any): Observable<PageResult<EggCategoryStockDto>> {
    return this.http.get<PageResult<EggCategoryStockDto>>(`${this.baseUrl}/stock/search`, { params: searchValues });
  }

  public edit(eggCategory: EggCategoryDto): Observable<any> {
    return this.http.put(`${this.baseUrl}`, eggCategory);
  }

  public findAll(): Observable<EggCategoryDto[]> {
    return this.http.get<EggCategoryDto[]>(`${this.baseUrl}/all`);
  }
}