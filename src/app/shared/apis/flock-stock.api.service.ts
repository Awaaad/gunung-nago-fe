import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FlockStockCountDto } from 'generated-src/model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class FlockStockApiService {
  baseUrl = `${environment.apiPath}flock-stocks`;

  constructor(private http: HttpClient) { }

  public findTotalFlockStockCount(): Observable<FlockStockCountDto> {
    return this.http.get<FlockStockCountDto>(`${this.baseUrl}`);
  }
}
