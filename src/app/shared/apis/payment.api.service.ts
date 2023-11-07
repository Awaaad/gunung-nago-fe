import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TodayAndCurrentMonthPaymentDto } from 'generated-src/model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentApiService {

  baseUrl = `${environment.apiPath}payment/`;

  constructor(private http: HttpClient) { }

  public getTodayAndMonthSales(): Observable<TodayAndCurrentMonthPaymentDto> {
    return this.http.get<TodayAndCurrentMonthPaymentDto>(`${this.baseUrl}sales-payment-today`);
  }

}
