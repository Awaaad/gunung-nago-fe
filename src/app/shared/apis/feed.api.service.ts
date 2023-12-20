import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FeedCategory, FeedDto, FeedStockAllocationDto, FeedStockDto, FeedStockSaveDto } from 'generated-src/model';
import { PageResult } from 'generated-src/model-front';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class FeedApiService {
  baseUrl = `${environment.apiPath}feeds`;

  constructor(private http: HttpClient) { }

  public save(feeds: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, feeds, { responseType: 'text' });
  }

  public edit(feedDto: FeedDto): Observable<any> {
    return this.http.put(`${this.baseUrl}`, feedDto);
  }

  public search(searchValues: any): Observable<PageResult<FeedDto>> {
    return this.http.get<PageResult<FeedDto>>(`${this.baseUrl}/search`, { params: searchValues });
  }

  public searchFeedStock(searchValues: any): Observable<PageResult<FeedStockDto>> {
    return this.http.get<PageResult<FeedStockDto>>(`${this.baseUrl}stock/search`, { params: searchValues });
  }

  public findFeedStockByFeedId(id: number): Observable<FeedStockSaveDto> {
    return this.http.get<FeedStockSaveDto>(`${this.baseUrl}/stock/${id}`);
  }

  public findFeedStockForAllocationByFeedCategory(category: FeedCategory): Observable<FeedStockDto> {
    return this.http.get<FeedStockDto>(`${this.baseUrl}/allocation?feedCategory=${category}`);
  }

  public findAllFeedStockForAllocation(): Observable<FeedStockDto[]> {
    return this.http.get<FeedStockDto[]>(`${this.baseUrl}/allocation`);
  }

  public findFeedFormAllocation(feedStockId: number, cageCategory: string): Observable<FeedStockAllocationDto[]> {
    return this.http.get<FeedStockAllocationDto[]>(`${this.baseUrl}/allocation/form/${feedStockId}/${cageCategory}`);
  }
}