import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FeedStockDto } from 'generated-src/model';
import { FeedStockFrontDto } from 'generated-src/model-front';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class FeedStockApiService {
  baseUrl = `${environment.apiPath}feed-stocks`;

  constructor(private http: HttpClient) { }

  public save(feedStocks: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, feedStocks, { responseType: 'text' });
  }

  public findFeedStockByFeedId(feedId: number | any): Observable<FeedStockFrontDto[] | any> {
    return this.http.get<FeedStockFrontDto[] | any>(`${this.baseUrl}/${feedId}`);
  }
}