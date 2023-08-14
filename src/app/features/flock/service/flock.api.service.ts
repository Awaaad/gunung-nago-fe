import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FlockDto } from 'generated-src/model';
import { PageResult } from 'generated-src/model-front';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class FlockApiService {
  baseUrl = `${environment.apiPath}flocks/`;

  constructor(private http: HttpClient) { }

  public search(searchValues: any): Observable<PageResult<FlockDto>> {
    return this.http.get<PageResult<FlockDto>>(`${this.baseUrl}search`, { params: searchValues });
  }
}
