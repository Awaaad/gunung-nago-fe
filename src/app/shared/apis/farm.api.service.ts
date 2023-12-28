import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FarmDto } from 'generated-src/model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class FarmApiService {
    baseUrl = `${environment.apiPath}farms`;

    constructor(private http: HttpClient) { }

    public findAll(): Observable<FarmDto[]> {
        return this.http.get<FarmDto[]>(`${this.baseUrl}`);
    }
}