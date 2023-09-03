import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class HealthProductStockApiService {
    baseUrl = `${environment.apiPath}health-product-stocks/`;

    constructor(private http: HttpClient) { }

    public save(healthProductStockSaveDtos: any): Observable<any> {
        return this.http.post(`${this.baseUrl}`, healthProductStockSaveDtos, { responseType: 'text' });
    }
}