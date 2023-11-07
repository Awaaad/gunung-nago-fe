import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FlockCageTransferDto, FlockDto, FlockStockCountDto, FlocksCategoryDto, TotalFlocksAndPercentageChangeDto } from 'generated-src/model';
import { FlockCageIncompatibleFrontDto, FlockFrontDto, FlockSaveFrontDto, PageResult } from 'generated-src/model-front';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class FlockApiService {
  baseUrl = `${environment.apiPath}flocks/`;

  constructor(private http: HttpClient) { }

  public save(flockSaveDto: FlockSaveFrontDto): Observable<any> {
    return this.http.post(`${this.baseUrl}`, flockSaveDto, { responseType: 'text' });
  }

  public search(searchValues: any): Observable<PageResult<FlockDto>> {
    return this.http.get<PageResult<FlockDto>>(`${this.baseUrl}search`, { params: searchValues });
  }

  public findTotalFlockStockCount(): Observable<FlockStockCountDto> {
    return this.http.get<FlockStockCountDto>(`${this.baseUrl}count`);
  }

  public findAllActiveFlocksWithoutCage(): Observable<FlockFrontDto[]> {
    return this.http.get<FlockFrontDto[]>(`${this.baseUrl}no-cage`);
  }

  public findFlocksWithIncompatibleCages(): Observable<FlockCageIncompatibleFrontDto[]> {
    return this.http.get<FlockCageIncompatibleFrontDto[]>(`${this.baseUrl}incompatible`);
  }

  public updateFlockStock(flockPurchaseDto: any): Observable<any> {
    return this.http.post(`${this.baseUrl}stock`, flockPurchaseDto, { responseType: 'text' });
  }

  public transferFlockToCage(flockCageTransferDtos: FlockCageTransferDto[]): Observable<any> {
    return this.http.put(`${this.baseUrl}transfer`, flockCageTransferDtos, { responseType: 'text' });
  }

  public getTotalFlocksAndPercentageChange(): Observable<any> {
    return this.http.get<TotalFlocksAndPercentageChangeDto>(`${this.baseUrl}today-total-flocks`);
  }

  public getTotalFlocksPerCategory(): Observable<FlocksCategoryDto> {
    return this.http.get<FlocksCategoryDto>(`${this.baseUrl}total-flocks-per-category`);
  }
}
