import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HealthProductDto, HealthProductStockSaveDto, HealthSurveyDto } from 'generated-src/model';
import { PageResult } from 'generated-src/model-front';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class HealthProductApiService {
  baseUrl = `${environment.apiPath}health-products/`;

  constructor(private http: HttpClient) { }

  public save(healthProducts: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, healthProducts, { responseType: 'text' });
  }

  public edit(healthReportDto: HealthProductDto): Observable<any> {
    return this.http.put(`${this.baseUrl}`, healthReportDto);
  }

  public findById(id: number): Observable<HealthSurveyDto> {
    return this.http.get<HealthSurveyDto>(`${this.baseUrl}${id}`);
  }

  public getAllHealthProducts(): Observable<HealthProductDto[]> {
    return this.http.get<HealthProductDto[]>(`${this.baseUrl}all`);
  }

  public findHealthSurveyDtoByHealthProductId(id: number): Observable<HealthSurveyDto> {
    return this.http.get<HealthSurveyDto>(`${this.baseUrl}survey/${id}`);
  }

  public findHealthProductStockByHealthProductId(id: number): Observable<HealthProductStockSaveDto> {
    return this.http.get<HealthProductStockSaveDto>(`${this.baseUrl}stock/${id}`);
  }

  public search(searchValues: any): Observable<PageResult<HealthProductDto>> {
    return this.http.get<PageResult<HealthProductDto>>(`${this.baseUrl}search`, { params: searchValues });
  }

  public searchHealthProduct(searchValues: any): Observable<HealthProductDto[]> {
    return this.http.get<HealthProductDto[]>(`${this.baseUrl}survey/search`, { params: searchValues });
  }
}
