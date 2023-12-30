import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DeliveryPageResponse } from '../models/delivery/http/response/delivery-page-response.model';
import { DeliveryResponse } from '../models/delivery/http/response/delivery-response.model';
import { DeliveryRequest } from '../models/delivery/http/request/delivery-request.model';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  private static _headers = { 'Content-Type': 'application/json' };
  private apiUrl = environment.apiUrl + '/deliveries';

  constructor(private _http: HttpClient) {}

  public static get getHeaders(): object {
    return DeliveryService._headers;
  }

  public get getHttpClient(): HttpClient {
    return this._http;
  }

  public getAllDeliveries(): Observable<DeliveryResponse[]> {
    return this.getHttpClient.get<DeliveryResponse[]>(this.apiUrl + '/all');
  }

  public getAllDeliveriesPaginated(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: string = 'asc',
  ): Observable<DeliveryPageResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder);
    return this.getHttpClient.get<DeliveryPageResponse>(this.apiUrl, { params });
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

  public getDelivery(publicId: string): Observable<DeliveryResponse> {
    return this.getHttpClient.get<DeliveryResponse>(`${this.apiUrl}/${publicId}`);
  }

  public createDelivery(deliveryRequest: DeliveryRequest): Observable<DeliveryResponse> {
    return this.getHttpClient.post<DeliveryResponse>(
      this.apiUrl,
      deliveryRequest.toHTTPJsonBody(),
      DeliveryService.getHeaders,
    );
  }

  public updateDelivery(publicId: string, deliveryRequest: DeliveryRequest): Observable<DeliveryResponse> {
    return this.getHttpClient.put<DeliveryResponse>(
      `${this.apiUrl}/${publicId}`,
      deliveryRequest.toHTTPJsonBody(),
      DeliveryService.getHeaders,
    );
  }

  public deleteDelivery(publicId: string): Observable<void> {
    return this.getHttpClient.delete<void>(`${this.apiUrl}/${publicId}`);
  }
}
