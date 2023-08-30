import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HealthProductDto, HealthSurveyDto } from 'generated-src/model';
import { PageResult } from 'generated-src/model-front';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class HealthApiService {
  baseUrl = `${environment.apiPath}healths/`;

  constructor(private http: HttpClient) { }

  public getAllHealthProducts(): Observable<HealthProductDto[]> {
    return this.http.get<HealthProductDto[]>(`${this.baseUrl}all`);
  }

  public findHealthSurveyDtoByHealthProductId(id: number): Observable<HealthSurveyDto> {
    return this.http.get<HealthSurveyDto>(`${this.baseUrl}${id}`);
  }

  public search(searchValues: any): Observable<PageResult<HealthProductDto>> {
    return this.http.get<PageResult<HealthProductDto>>(`${this.baseUrl}search`, { params: searchValues });
  }
}
