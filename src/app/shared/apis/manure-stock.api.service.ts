import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ManureStockDto } from 'generated-src/model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class ManureStockApiService {
    baseUrl = `${environment.apiPath}manures/`;

    constructor(private http: HttpClient) { }

    public findManureStockForSale(): Observable<ManureStockDto> {
        return this.http.get<ManureStockDto>(`${this.baseUrl}`);
    }

    public saveManureStockTrace(manureStockDtos: ManureStockDto[]): Observable<any> {
        return this.http.post(`${this.baseUrl}`, manureStockDtos, { responseType: 'text' });
    }
}