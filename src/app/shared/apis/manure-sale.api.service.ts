import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class ManureSaleApiService {
    baseUrl = `${environment.apiPath}manure-sales/`;

    constructor(private http: HttpClient) { }

    public save(manureSaleSaveDto: any): Observable<any> {
        return this.http.post(`${this.baseUrl}`, manureSaleSaveDto, { responseType: 'text' });
    }
}