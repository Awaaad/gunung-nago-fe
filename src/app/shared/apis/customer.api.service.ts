
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomerDto } from 'generated-src/model';
import { PageResult } from 'generated-src/model-front';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class CustomerApiService {
    baseUrl = `${environment.apiPath}customers`;

    constructor(private http: HttpClient) { }

    public save(customers: any): Observable<any> {
        return this.http.post(`${this.baseUrl}`, customers, { responseType: 'text' });
    }

    public edit(customerDto: CustomerDto): Observable<any> {
        return this.http.put(`${this.baseUrl}`, customerDto);
    }

    public search(searchValues: any): Observable<PageResult<CustomerDto>> {
        return this.http.get<PageResult<CustomerDto>>(`${this.baseUrl}/search`, { params: searchValues });
    }
}