import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EggStockDto } from 'generated-src/model';
import { EggTransferFrontDto } from 'generated-src/model-front';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class EggStockApiService {
  baseUrl = `${environment.apiPath}eggs/`;

  constructor(private http: HttpClient) { }

  public findEggStockForSale(): Observable<EggStockDto> {
    return this.http.get<EggStockDto>(`${this.baseUrl}`);
  }

  public transfer(eggTransferDto: EggTransferFrontDto): Observable<any> {
    return this.http.post(`${this.baseUrl}transfer`, eggTransferDto, { responseType: 'text' });
}
}
