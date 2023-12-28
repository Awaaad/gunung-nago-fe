import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RoleDto } from 'generated-src/model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class RoleApiService {
    baseUrl = `${environment.apiPath}roles`;

    constructor(private http: HttpClient) { }

    public findAll(): Observable<RoleDto[]> {
        return this.http.get<RoleDto[]>(`${this.baseUrl}`);
    }
}