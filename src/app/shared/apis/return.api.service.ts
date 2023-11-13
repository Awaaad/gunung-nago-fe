import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SaleSaveFrontDto } from "generated-src/model-front";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class ReturnApiService {
  baseUrl = `${environment.apiPath}return/`;

  constructor(private http: HttpClient) { }

  public save(saleSaveFrontDto: SaleSaveFrontDto): Observable<any> {
    return this.http.post(`${this.baseUrl}`, saleSaveFrontDto, { responseType: 'text' });
  }
}