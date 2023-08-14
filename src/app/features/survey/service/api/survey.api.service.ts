import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SurveyDto } from 'generated-src/model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class SurveyApiService {

  baseUrl = `${environment.apiPath}surveys/`;

  constructor(private http: HttpClient) { }

  public findById(cageId: number): Observable<SurveyDto> {
    return this.http.get<SurveyDto>(`${this.baseUrl}${cageId}`);
  }
}
