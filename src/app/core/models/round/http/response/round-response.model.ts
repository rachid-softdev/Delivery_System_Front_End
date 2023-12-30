import { Deserialize } from '../../../../../shared/deserialize/deserialize';
import { DeliveryResponse } from '../../../delivery/http/response/delivery-response.model';
import { DriverResponse } from '../../../driver/http/response/driver-response.model';

export class RoundResponse implements Deserialize<string> {
  private _createdAt: string;
  private _updatedAt: string;
  private _publicId: string;
  private _name: string;
  private _startDate: string;
  private _endDate: string;
  private _driver: DriverResponse | null;
  private _deliveries: DeliveryResponse[];

  constructor(
    createdAt: string = '',
    updatedAt: string = '',
    publicId: string = '',
    name: string = '',
    startDate: string = '',
    endDate: string = '',
    driver: DriverResponse | null = null,
    deliveries: DeliveryResponse[] = [],
  ) {
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._publicId = publicId;
    this._name = name;
    this._startDate = startDate;
    this._endDate = endDate;
    this._driver = driver;
    this._deliveries = deliveries;
  }

  public get getCreatedAt(): string {
    return this._createdAt;
  }

  public set setCreatedAt(createdAt: string) {
    this._createdAt = createdAt;
  }

  public get getUpdatedAt(): string {
    return this._updatedAt;
  }

  public set setUpdatedAt(updatedAt: string) {
    this._updatedAt = updatedAt;
  }

  public get getPublicId(): string {
    return this._publicId;
  }

  public set setPublicId(publicId: string) {
    this._publicId = publicId;
  }

  public get getName(): string {
    return this._name;
  }

  public set setName(name: string) {
    this._name = name;
  }

  public get getStartDate(): string {
    return this._startDate;
  }

  public set setStartDate(startDate: string) {
    this._startDate = startDate;
  }

  public get getEndDate(): string {
    return this._endDate;
  }

  public set setEndDate(endDate: string) {
    this._endDate = endDate;
  }

  public get getDriver(): DriverResponse | null {
    return this._driver;
  }

  public set setDriver(driver: DriverResponse | null) {
    this._driver = driver;
  }

  public get getDeliveries(): DeliveryResponse[] {
    return this._deliveries;
  }

  public set setDeliveries(deliveries: DeliveryResponse[]) {
    this._deliveries = deliveries;
  }

  deserialize(input: any): string {
    return Object.assign(this, input);
  }

  static mapToRoundResponse(apiData: {
    createdAt?: string;
    updatedAt?: string;
    publicId?: string;
    name?: string;
    startDate?: string;
    endDate?: string;
    driver: {
      publicId?: string;
      createdAt?: string;
      updatedAt?: string;
      name?: string;
      available?: boolean;
    };
    deliveries: [
      {
        createdAt?: string;
        updatedAt?: string;
        publicId?: string;
        pickupAddress?: string;
        dropoffAddress?: string;
        round?: RoundResponse;
      },
    ];
  }): RoundResponse {
    const driver = apiData?.driver ? RoundResponse.mapToDriverResponse(apiData.driver) : null;
    const deliveriesResponse =
      apiData?.deliveries?.map((delivery) => RoundResponse.mapToDeliveryResponse(delivery)) ?? [];
    const round = new RoundResponse(
      apiData.createdAt ?? '',
      apiData.updatedAt ?? '',
      apiData.publicId ?? '',
      apiData.name ?? '',
      apiData.startDate ?? '',
      apiData.endDate ?? '',
      driver,
      deliveriesResponse,
    );
    return round;
  }

  private static mapToDriverResponse(apiData: {
    publicId?: string;
    createdAt?: string;
    updatedAt?: string;
    name?: string;
    available?: boolean;
  }): DriverResponse {
    const driver = new DriverResponse(
      apiData.publicId ?? '',
      apiData.createdAt ?? '',
      apiData.updatedAt ?? '',
      apiData.name ?? '',
      apiData.available ?? false,
      [],
    );
    return driver;
  }

  private static mapToDeliveryResponse(apiData: {
    createdAt?: string;
    updatedAt?: string;
    publicId?: string;
    pickupAddress?: string;
    dropoffAddress?: string;
  }): DeliveryResponse {
    const round = new DeliveryResponse(
            apiData.createdAt ?? '',
      apiData.updatedAt ?? '',
      apiData.publicId ?? '',
      apiData.pickupAddress ?? '',
      apiData.dropoffAddress ?? '',
      null,
    );
    return round;
  }

  toString(): string {
    return `RoundResponse [publicId=${this._publicId}, createdAt=${this._createdAt}, updatedAt=${this._updatedAt} name=${this._name}, startDate=${this._startDate}, endDate=${this._endDate}]`;
  }
}
