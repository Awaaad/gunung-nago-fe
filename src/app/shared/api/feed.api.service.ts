import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FeedCategory, FeedDto, FeedStockAllocationDto, FeedStockDto, FeedStockSaveDto } from 'generated-src/model';
import { PageResult } from 'generated-src/model-front';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class FeedApiService {
  baseUrl = `${environment.apiPath}feeds/`;

  constructor(private http: HttpClient) { }

  public save(feeds: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, feeds, { responseType: 'text' });
  }

  public search(searchValues: any): Observable<PageResult<FeedDto>> {
    return this.http.get<PageResult<FeedDto>>(`${this.baseUrl}search`, { params: searchValues });
  }

  public findFeedStockByFeedId(id: number): Observable<FeedStockSaveDto> {
    return this.http.get<FeedStockSaveDto>(`${this.baseUrl}stock/${id}`);
  }

  public findFeedStockForAllocationByFeedCategory(category: FeedCategory): Observable<FeedStockDto> {
    return this.http.get<FeedStockDto>(`${this.baseUrl}allocation?feedCategory=${category}`);
  }

  public findFeedFormAllocation(): Observable<FeedStockAllocationDto[]> {
    return this.http.get<FeedStockAllocationDto[]>(`${this.baseUrl}allocation/form`);
  }
}