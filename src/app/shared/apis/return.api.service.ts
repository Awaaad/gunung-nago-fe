import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ReturnInvoiceFrontDto, SaleSaveFrontDto } from "generated-src/model-front";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class ReturnApiService {
  baseUrl = `${environment.apiPath}return`;

  constructor(private http: HttpClient) { }

  public save(saleSaveFrontDto: SaleSaveFrontDto): Observable<any> {
    return this.http.post(`${this.baseUrl}`, saleSaveFrontDto, { responseType: 'text' });
  }

  public getReturnDetailsBySalesInvoiceId(id:number): Observable<ReturnInvoiceFrontDto[]> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
}