import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { PageResult } from 'generated-src/model-front';
import { CageDto } from 'generated-src/model';

@Injectable()
export class CageApiService {
  baseUrl = `${environment.apiPath}cages/`;

  constructor(private http: HttpClient) { }

  public save(cages: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, cages, {responseType: 'text'});
  }

  public edit(cageDto: CageDto): Observable<any> {
    return this.http.put(`${this.baseUrl}`, cageDto);
  }

  public findById(id: number): Observable<CageDto> {
    return this.http.get<CageDto>(`${this.baseUrl}${id}`);
  }

  public search(searchValues: any): Observable<PageResult<CageDto>> {
    return this.http.get<PageResult<CageDto>>(`${this.baseUrl}search`, { params: searchValues });
  }

  public getAllActiveCages(): Observable<CageDto[]> {
    return this.http.get<CageDto[]>(`${this.baseUrl}all`);
  }
}
