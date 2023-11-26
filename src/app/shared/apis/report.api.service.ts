import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DailyProductionReportDto, EggReportDto } from 'generated-src/model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class ReportApiService {
  baseUrl = `${environment.apiPath}reports/`;

  constructor(private http: HttpClient) { }

  public findDailyProductionReport(date: any): Observable<DailyProductionReportDto[]> {
    return this.http.get<DailyProductionReportDto[]>(`${this.baseUrl}daily?date=${date}`);
  }

  public findEggCategoryStockTransactionsByEggStockAndDate(searchValues: any): Observable<EggReportDto[]> {
    return this.http.get<EggReportDto[]>(`${this.baseUrl}egg`, { params: searchValues });
  }
}
