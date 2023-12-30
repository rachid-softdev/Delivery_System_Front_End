import { Deserialize } from '../../../../../shared/deserialize/deserialize';
import { DeliveryResponse } from '../../../delivery/http/response/delivery-response.model';
import { DriverResponse } from '../../../driver/http/response/driver-response.model';

export class RoundRequest implements Deserialize<string> {
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

  public toHTTPJsonBody(): object {
    console.log(this.getDriver);
    return {
      createdAt: this.getCreatedAt,
      updatedAt: this.getUpdatedAt,
      name: this.getName,
      startDate: this.getStartDate,
      endDate: this.getEndDate,
      driver: this.getDriver
        ? {
            publicId: this.getDriver.getPublicId,
            name: this.getDriver.getName,
            available: this.getDriver.isAvailable,
          }
        : null,
      deliveries: this.getDeliveries?.map((delivery) => ({
        publicId: delivery.getPublicId,
        pickupAddress: delivery.getPickupAddress,
        dropoffAddress: delivery.getDropoffAddress,
      })),
    };
  }

  deserialize(input: any): string {
    return Object.assign(this, input);
  }

  toString(): string {
    return `RoundRequest [publicId=${this._publicId}, createdAt=${this._createdAt}, updatedAt=${this._updatedAt} name=${this._name}, startDate=${this._startDate}, endDate=${this._endDate}]`;
  }
}
