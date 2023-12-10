import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class FeedSaleApiService {
    baseUrl = `${environment.apiPath}feed-sales`;

    constructor(private http: HttpClient) { }

    public save(feedSaleSaveDto: any): Observable<any> {
        return this.http.post(`${this.baseUrl}`, feedSaleSaveDto, { responseType: 'text' });
    }
}
