import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { PaymentModeDto } from "generated-src/model";
import { PageResult } from "generated-src/model-front";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root',
})
export class PaymentModeApiService {
    baseUrl = `${environment.apiPath}payment-modes`;

    constructor(private http: HttpClient) { }

    public save(paymentModes: any): Observable<any> {
        return this.http.post(`${this.baseUrl}`, paymentModes, { responseType: 'text' });
    }

    public search(searchValues: any): Observable<PageResult<PaymentModeDto>> {
        return this.http.get<PageResult<PaymentModeDto>>(`${this.baseUrl}/search`, { params: searchValues });
    }

    public edit(paymentModeDto: PaymentModeDto): Observable<any> {
        return this.http.put(`${this.baseUrl}`, paymentModeDto);
    }

    public findAll(): Observable<PaymentModeDto[]> {
        return this.http.get<PaymentModeDto[]>(`${this.baseUrl}/all`);
    }
}