import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SurveyDto } from 'generated-src/model';
import { SurveyFrontDto } from 'generated-src/model-front';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class SurveyApiService {
  baseUrl = `${environment.apiPath}surveys`;

  constructor(private http: HttpClient) { }

  public save(surveyDto: SurveyFrontDto): Observable<any> {
    return this.http.post(`${this.baseUrl}`, surveyDto, {responseType: 'text'});
  }

  public edit(surveyDto: SurveyFrontDto): Observable<any> {
    return this.http.put(`${this.baseUrl}`, surveyDto, {responseType: 'text'});
  }

  public findSurveyByCageId(cageId: number): Observable<SurveyDto> {
    return this.http.get<SurveyDto>(`${this.baseUrl}/${cageId}`);
  }

  public findMostRecentSurveyDtoForCage(cageId: number): Observable<SurveyDto> {
    return this.http.get<SurveyDto>(`${this.baseUrl}/recent/${cageId}`);
  }

  public findIfSurveyHasBeenRegisteredForCage(cageId: number): Observable<string> {
    return this.http.get<string>(`${this.baseUrl}/surveyed/${cageId}`);
  }

  public flockStockExistsForSelectedCageByCageId(cageId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/flock-stock/${cageId}`);
  }
}
