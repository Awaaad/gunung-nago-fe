import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FlockFeedLineDto } from 'generated-src/model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class FlockFeedLineApiService {
    baseUrl = `${environment.apiPath}feed-lines/`;

    constructor(private http: HttpClient) { }

    public findAllActiveFlockLinesByFlockId(id: number): Observable<FlockFeedLineDto[]> {
        return this.http.get<FlockFeedLineDto[]>(`${this.baseUrl}${id}`);
    }
}