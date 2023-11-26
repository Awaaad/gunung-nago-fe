import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { PaymentModeDto } from "generated-src/model";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root',
})
export class PaymentModeApiService {
    baseUrl = `${environment.apiPath}payment-modes/`;

    constructor(private http: HttpClient) { }

    public save(paymentModes: any): Observable<any> {
        return this.http.post(`${this.baseUrl}`, paymentModes, { responseType: 'text' });
    }

    public findAll(): Observable<PaymentModeDto[]> {
        return this.http.get<PaymentModeDto[]>(`${this.baseUrl}all`);
    }
}