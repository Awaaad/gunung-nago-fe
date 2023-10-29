import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ReceiptDetailsDto } from 'generated-src/model';
@Injectable()
export class ReceiptApiService {
    baseUrl = `${environment.apiPath}receipts/`;

    constructor(private http: HttpClient) { }

    public findReceiptDetailsById(id: number): Observable<ReceiptDetailsDto> {
        return this.http.get<any>(`${this.baseUrl}${id}`);
    }
}