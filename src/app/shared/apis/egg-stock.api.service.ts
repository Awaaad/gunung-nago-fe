import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EggStockDto } from 'generated-src/model';
import { EggStockFrontDto, EggTransferFrontDto } from 'generated-src/model-front';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class EggStockApiService {
  baseUrl = `${environment.apiPath}eggs`;

  constructor(private http: HttpClient) { }

  public findEggStockForSale(): Observable<EggStockDto> {
    return this.http.get<EggStockDto>(`${this.baseUrl}`);
  }

  public edit(eggStockDto: EggStockFrontDto): Observable<any> {
    return this.http.put(`${this.baseUrl}`, eggStockDto);
  }

  public transfer(eggTransferDtos: EggTransferFrontDto[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/transfer`, eggTransferDtos, { responseType: 'text' });
  }
}
