import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FarmDto } from 'generated-src/model';
import { PageResult } from 'generated-src/model-front';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class FarmApiService {
    baseUrl = `${environment.apiPath}farms`;

    constructor(private http: HttpClient) { }

    public findAll(): Observable<FarmDto[]> {
        return this.http.get<FarmDto[]>(`${this.baseUrl}`);
    }

    public search(searchValues: any): Observable<PageResult<FarmDto>> {
        return this.http.get<PageResult<FarmDto>>(`${this.baseUrl}/search`, { params: searchValues });
    }

    public edit(farmDto: FarmDto): Observable<string> {
        return this.http.put<string>(this.baseUrl, farmDto);
    }

    public save(usersDto: FarmDto[]): Observable<string> {
        return this.http.post<string>(this.baseUrl, usersDto);
    }
}