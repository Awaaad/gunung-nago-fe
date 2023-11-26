import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BankAccountDto } from "generated-src/model";
import { PageResult } from "generated-src/model-front";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root',
})
export class BankAccountApiService {
    baseUrl = `${environment.apiPath}bank-accounts/`;

    constructor(private http: HttpClient) { }

    public save(bankAccounts: any): Observable<any> {
        return this.http.post(`${this.baseUrl}`, bankAccounts, { responseType: 'text' });
    }

    public search(searchValues: any): Observable<PageResult<BankAccountDto>> {
        return this.http.get<PageResult<BankAccountDto>>(`${this.baseUrl}search`, { params: searchValues });
    }

    public edit(bankAccountDto: BankAccountDto): Observable<any> {
        return this.http.put(`${this.baseUrl}`, bankAccountDto);
    }

    public findAll(): Observable<BankAccountDto[]> {
        return this.http.get<BankAccountDto[]>(`${this.baseUrl}all`);
    }
}