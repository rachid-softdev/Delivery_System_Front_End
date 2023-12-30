import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RoundPageResponse } from '../models/round/http/response/round-page-response.model';
import { RoundResponse } from '../models/round/http/response/round-response.model';
import { RoundRequest } from '../models/round/http/request/round-request.model';

@Injectable({
  providedIn: 'root',
})
export class RoundService {
  private static _headers = { 'Content-Type': 'application/json' };
  private apiUrl = environment.apiUrl + '/rounds';

  constructor(private _http: HttpClient) {}

  public static get getHeaders(): object {
    return RoundService._headers;
  }

  public get getHttpClient(): HttpClient {
    return this._http;
  }

  public getAllRounds(): Observable<RoundResponse[]> {
    return this.getHttpClient.get<RoundResponse[]>(this.apiUrl + '/all');
  }

  public getAllRoundsPaginated(
    searchDate: Date | null = null,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: string = 'asc',
  ): Observable<RoundPageResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder)
      .set('search_date', searchDate ? searchDate.toISOString() : '');
    return this.getHttpClient.get<RoundPageResponse>(this.apiUrl, { params });
  }

  private toDateString(date: Date): string {
    return (
      date.getFullYear().toString() +
      '-' +
      ('0' + (date.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + date.getDate()).slice(-2) +
      'T' +
      date.toTimeString().slice(0, 5)
    );
  }

  public getRound(publicId: string): Observable<RoundResponse> {
    return this.getHttpClient.get<RoundResponse>(`${this.apiUrl}/${publicId}`);
  }

  public createRound(roundRequest: RoundRequest): Observable<RoundResponse> {
    return this.getHttpClient.post<RoundResponse>(this.apiUrl, roundRequest.toHTTPJsonBody(), RoundService.getHeaders);
  }

  public updateRound(publicId: string, roundRequest: RoundRequest): Observable<RoundResponse> {
    return this.getHttpClient.put<RoundResponse>(
      `${this.apiUrl}/${publicId}`,
      roundRequest.toHTTPJsonBody(),
      RoundService.getHeaders,
    );
  }

  public deleteRound(publicId: string): Observable<void> {
    return this.getHttpClient.delete<void>(`${this.apiUrl}/${publicId}`);
  }
}
