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

  public search(searchValues: any): Observable<PageResult<CageDto>> {
    return this.http.get<PageResult<CageDto>>(`${this.baseUrl}search`, { params: searchValues });
  }
}
