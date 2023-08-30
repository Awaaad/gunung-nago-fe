import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FlockSaleSaveFrontDto } from 'generated-src/model-front';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class FlockSaleApiService {
  baseUrl = `${environment.apiPath}flock-sales/`;

  constructor(private http: HttpClient) { }

  public save(flockSaleSaveDto: FlockSaleSaveFrontDto): Observable<any> {
    return this.http.post(`${this.baseUrl}`, flockSaleSaveDto, { responseType: 'text' });
  }
}
