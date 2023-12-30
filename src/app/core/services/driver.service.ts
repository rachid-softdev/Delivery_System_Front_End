import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DriverPageResponse } from '../models/driver/http/response/driver-page-response.model';
import { DriverResponse } from '../models/driver/http/response/driver-response.model';
import { DriverRequest } from '../models/driver/http/request/driver-request.model';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  private static _headers = { 'Content-Type': 'application/json' };
  private apiUrl = environment.apiUrl + '/drivers';

  constructor(private _http: HttpClient) {}

  public static get getHeaders(): object {
    return DriverService._headers;
  }

  public get getHttpClient(): HttpClient {
    return this._http;
  }

  public getAllDrivers(): Observable<DriverResponse[]> {
    return this.getHttpClient.get<DriverResponse[]>(this.apiUrl + '/all');
  }

  public getAllDriversPaginated(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: string = 'asc',
  ): Observable<DriverPageResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder);
    return this.getHttpClient.get<DriverPageResponse>(this.apiUrl, { params });
  }

  public searchDrivers(
    createdAtAfter: Date | null = null,
    createdAtBefore: Date | null,
    isAvailable: boolean = false,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: string = 'asc',
  ) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder)
      .set('available', isAvailable)
      .set('created_at_after', createdAtAfter ? createdAtAfter.toISOString() : '')
      .set('created_at_before', createdAtBefore ? createdAtBefore.toISOString() : '');
    return this.getHttpClient.get<DriverPageResponse>(this.apiUrl + '/search', { params });
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

  public getDriver(publicId: string): Observable<DriverResponse> {
    return this.getHttpClient.get<DriverResponse>(`${this.apiUrl}/${publicId}`);
  }

  public createDriver(driverRequest: DriverRequest): Observable<DriverResponse> {
    return this.getHttpClient.post<DriverResponse>(
      this.apiUrl,
      driverRequest.toHTTPJsonBody(),
      DriverService.getHeaders,
    );
  }

  public updateDriver(publicId: string, driverRequest: DriverRequest): Observable<DriverResponse> {
    return this.getHttpClient.put<DriverResponse>(
      `${this.apiUrl}/${publicId}`,
      driverRequest.toHTTPJsonBody(),
      DriverService.getHeaders,
    );
  }

  public deleteDriver(publicId: string): Observable<void> {
    return this.getHttpClient.delete<void>(`${this.apiUrl}/${publicId}`);
  }
}
