import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class PurchaseApiService {
  baseUrl = `${environment.apiPath}purchases/`;

  constructor(private http: HttpClient) { }

  public save(purchaseSaveDto: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, purchaseSaveDto, { responseType: 'text' });
  }
}
