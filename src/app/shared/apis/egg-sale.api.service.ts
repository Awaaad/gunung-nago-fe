import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EggSaleSaveDto } from 'generated-src/model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class EggSaleApiService {
  baseUrl = `${environment.apiPath}egg-sales/`;

  constructor(private http: HttpClient) { }

  public save(eggSaleSaveDto: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, eggSaleSaveDto, { responseType: 'text' });
  }
}
