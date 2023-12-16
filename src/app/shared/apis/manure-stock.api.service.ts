import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ManureDto, ManureStockDto } from 'generated-src/model';
import { PageResult } from 'generated-src/model-front';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class ManureStockApiService {
    baseUrl = `${environment.apiPath}manures`;

    constructor(private http: HttpClient) { }

    public findManures(): Observable<ManureDto[]> {
        return this.http.get<ManureDto[]>(`${this.baseUrl}`);
    }

    public search(searchValues: any): Observable<PageResult<ManureDto>> {
        return this.http.get<PageResult<ManureDto>>(`${this.baseUrl}/search`, { params: searchValues });
    }

    public edit(manureDto: ManureDto): Observable<any> {
        return this.http.put(`${this.baseUrl}`, manureDto);
    }

    public findManureStockByManureId(manureId: number): Observable<ManureStockDto[]> {
        return this.http.get<ManureStockDto[]>(`${this.baseUrl}/${manureId}`);
    }

    public save(manures: any): Observable<any> {
        return this.http.post(`${this.baseUrl}`, manures, { responseType: 'text' });
    }

    public saveManureStockTrace(manureStockDtos: ManureStockDto[]): Observable<any> {
        return this.http.post(`${this.baseUrl}/stock`, manureStockDtos, { responseType: 'text' });
    }
}