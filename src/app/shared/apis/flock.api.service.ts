import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FlockDto, FlockPurchaseDto } from 'generated-src/model';
import { FlockSaveFrontDto, PageResult } from 'generated-src/model-front';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class FlockApiService {
  baseUrl = `${environment.apiPath}flocks/`;

  constructor(private http: HttpClient) { }

  public save(flockSaveDto: FlockSaveFrontDto): Observable<any> {
    return this.http.post(`${this.baseUrl}`, flockSaveDto, {responseType: 'text'});
  }

  public search(searchValues: any): Observable<PageResult<FlockDto>> {
    return this.http.get<PageResult<FlockDto>>(`${this.baseUrl}search`, { params: searchValues });
  }

  public updateFlockStock(flockPurchaseDto: any): Observable<any> {
    return this.http.post(`${this.baseUrl}stock`, flockPurchaseDto, {responseType: 'text'});
  }
}
