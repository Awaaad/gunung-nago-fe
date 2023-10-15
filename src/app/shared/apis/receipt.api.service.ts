import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { EggReceiptDetailsDto, FlockReceiptDetailsDto } from 'generated-src/model';

@Injectable()
export class ReceiptApiService {
    baseUrl = `${environment.apiPath}receipts/`;

    constructor(private http: HttpClient) { }

    public findEggReceiptDetailsById(id: number): Observable<EggReceiptDetailsDto> {
        return this.http.get<any>(`${this.baseUrl}egg/${id}`);
    }

    public findFlockReceiptDetailsById(id: number): Observable<FlockReceiptDetailsDto> {
        return this.http.get<any>(`${this.baseUrl}flock/${id}`);
    }
}