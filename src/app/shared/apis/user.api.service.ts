import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDto } from 'generated-src/model';
import { PageResult } from 'generated-src/model-front';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class UserApiService {

    baseUrl = `${environment.apiPath}users/`;

    constructor(private http: HttpClient) { }

    // user
    public getAllUsers(): Observable<UserDto[]> {
        return this.http.get<UserDto[]>(this.baseUrl + 'all');
    }

    public search(searchValues: any): Observable<PageResult<UserDto>> {
        return this.http.get<PageResult<UserDto>>(`${this.baseUrl}search`, { params: searchValues });
    }

    public edit(userDto: UserDto): Observable<string> {
        return this.http.put<string>(this.baseUrl + 'edit-user', userDto);
    }

    public save(usersDto: UserDto[]): Observable<string> {
        return this.http.post<string>(this.baseUrl + 'save-users', usersDto);
    }
}
