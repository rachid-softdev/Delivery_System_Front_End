import { Deserialize } from '../../../../../shared/deserialize/deserialize';
import { RoundResponse } from '../../../round/http/response/round-response.model';

export class DeliveryResponse implements Deserialize<string> {
  private _createdAt: string;
  private _updatedAt: string;
  private _publicId: string;
  private _pickupAddress: string;
  private _dropoffAddress: string;
  private _round: RoundResponse | null;

  constructor(
    createdAt: string = '',
    updatedAt: string = '',
    publicId: string = '',
    pickupAddress: string = '',
    dropoffAddress: string = '',
    round: RoundResponse | null = null,
  ) {
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._publicId = publicId;
    this._pickupAddress = pickupAddress;
    this._dropoffAddress = dropoffAddress;
    this._round = round;
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

  public get getPickupAddress(): string {
    return this._pickupAddress;
  }

  public set setPickupAddress(pickupAddress: string) {
    this._pickupAddress = pickupAddress;
  }

  public get getDropoffAddress(): string {
    return this._dropoffAddress;
  }

  public set setDropoffAddress(dropoffAddress: string) {
    this._dropoffAddress = dropoffAddress;
  }

  public get getRound(): RoundResponse | null {
    return this._round;
  }

  public set setRound(round: RoundResponse | null) {
    this._round = round;
  }

  deserialize(input: any): string {
    return Object.assign(this, input);
  }

  static mapToDeliveryResponse(apiData: {
    createdAt?: string;
    updatedAt?: string;
    publicId?: string;
    pickupAddress?: string;
    dropoffAddress?: string;
    round?: {
      createdAt?: string;
      updatedAt?: string;
      publicId?: string;
      name?: string;
      startDate?: string;
      endDate?: string;
    };
  }): DeliveryResponse {
    const round = apiData.round ? DeliveryResponse.mapToRoundResponse(apiData.round) : null;
    const deliveryResponse = new DeliveryResponse(
      apiData.createdAt ?? '',
      apiData.updatedAt ?? '',
      apiData.publicId ?? '',
      apiData.pickupAddress ?? '',
      apiData.dropoffAddress ?? '',
      round,
    );
    return deliveryResponse;
  }

  private static mapToRoundResponse(apiData: {
    createdAt?: string;
    updatedAt?: string;
    publicId?: string;
    name?: string;
    startDate?: string;
    endDate?: string;
  }): RoundResponse {
    const round = new RoundResponse(
      apiData.createdAt ?? '',
      apiData.updatedAt ?? '',
      apiData.publicId ?? '',
      apiData.name ?? '',
      apiData.startDate ?? '',
      apiData.endDate ?? '',
    );
    return round;
  }

  toString(): string {
    return `DeliveryResponse [publicId=${this._publicId}, createdAt=${this._createdAt}, updatedAt=${this._updatedAt} pickupAddress=${this._pickupAddress}, dropoffAddress=${this._dropoffAddress}]`;
  }
}
