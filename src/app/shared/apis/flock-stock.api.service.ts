import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FeedSurveyDto, FlockStockCountDto, FlockStockDetailsDto, FlockStockDto, HealthSurveyDto, HealthSurveyStockDto, ManureStockDto, SurveyEggCountDto } from 'generated-src/model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class FlockStockApiService {
  baseUrl = `${environment.apiPath}flock-stocks`;

  constructor(private http: HttpClient) { }

  public findTotalFlockStockCount(): Observable<FlockStockCountDto> {
    return this.http.get<FlockStockCountDto>(`${this.baseUrl}`);
  }

  public findFlockStockByFlockStockId(flockStockId: number): Observable<FlockStockDetailsDto> {
    return this.http.get<FlockStockDetailsDto>(`${this.baseUrl}/details/${flockStockId}`);
  }

  public editFlock(flockStockDto: FlockStockDto): Observable<any> {
    return this.http.put(`${this.baseUrl}/flock`, flockStockDto, { responseType: 'text' });
  }

  public editEgg(surveyEggCountDto: SurveyEggCountDto): Observable<any> {
    return this.http.put(`${this.baseUrl}/egg`, surveyEggCountDto, { responseType: 'text' });
  }

  public addEgg(flockStockId: number, surveyEggCountDtos: SurveyEggCountDto[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/egg/add/${flockStockId}`, surveyEggCountDtos, { responseType: 'text' });
  }

  public editFeed(feedSurveyDto: FeedSurveyDto): Observable<any> {
    return this.http.put(`${this.baseUrl}/feed`, feedSurveyDto, { responseType: 'text' });
  }

  public editHealth(healthSurveyStockDto: HealthSurveyStockDto): Observable<any> {
    return this.http.put(`${this.baseUrl}/health`, healthSurveyStockDto, { responseType: 'text' });
  }

  public addHealth(flockStockId: number, healthSurveyDtos: HealthSurveyDto[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/health/add/${flockStockId}`, healthSurveyDtos, { responseType: 'text' });
  }

  public editManure(flockStockId: number, manureStockDtos: ManureStockDto[]): Observable<any> {
    return this.http.put(`${this.baseUrl}/manure/${flockStockId}`, manureStockDtos, { responseType: 'text' });
  }

  public addManure(flockStockId: number, manureStockDtos: ManureStockDto[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/manure/add/${flockStockId}`, manureStockDtos, { responseType: 'text' });
  }
}
