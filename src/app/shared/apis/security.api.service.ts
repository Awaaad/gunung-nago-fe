import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticatedUserDto, LoginParamDto, UserDto } from 'generated-src/model';

@Injectable({
    providedIn: 'root'
})
export class SecurityApiService {

    baseUrl = `${environment.apiPath}users`;

    constructor(private http: HttpClient) { }

    public authenticateUser(loginParam: LoginParamDto): Observable<AuthenticatedUserDto> {
        return this.http.post<AuthenticatedUserDto>(`${this.baseUrl}/authenticate`, loginParam);
    }

    public getAllUsernames(): Observable<string[]> {
        return this.http.get<string[]>(`${this.baseUrl}/usernames`);
    }

    public getAllDrivers(): Observable<UserDto[]> {
        return this.http.get<UserDto[]>(`${this.baseUrl}/drivers`);
    }
}
