import { Deserialize } from '../../../../../shared/deserialize/deserialize';
import { RoundResponse } from '../../../round/http/response/round-response.model';

export class DeliveryRequest implements Deserialize<string> {
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

  public toHTTPJsonBody(): object {
    return {
      createdAt: this.getCreatedAt,
      updatedAt: this.getUpdatedAt,
      publicId: this.getPublicId,
      pickupAddress: this.getPickupAddress,
      dropoffAddress: this.getDropoffAddress,
      round: this.getRound
        ? {
            publicId: this.getRound?.getPublicId,
            name: this.getRound?.getName,
            startDate: this.getRound?.getStartDate,
            endDate: this.getRound?.getEndDate,
          }
        : null,
    };
  }

  deserialize(input: any): string {
    return Object.assign(this, input);
  }

  toString(): string {
    return `DeliveryRequest [publicId=${this._publicId}, createdAt=${this._createdAt}, updatedAt=${this._updatedAt} pickupAddress=${this._pickupAddress}, dropoffAddress=${this._dropoffAddress}]`;
  }
}
