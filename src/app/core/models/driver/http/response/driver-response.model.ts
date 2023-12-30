import { Deserialize } from '../../../../../shared/deserialize/deserialize';
import { RoundResponse } from '../../../round/http/response/round-response.model';

export class DriverResponse implements Deserialize<string> {
  private _publicId: string;
  private _createdAt: string;
  private _updatedAt: string;
  private _name: string;
  private _isAvailable: boolean;
  private _rounds: RoundResponse[];

  constructor(
    publicId: string = '',
    createdAt: string = '',
    updatedAt: string = '',
    name: string = '',
    isAvailable: boolean = false,
    rounds: RoundResponse[] = [],
  ) {
    this._publicId = publicId;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._name = name;
    this._isAvailable = isAvailable;
    this._rounds = rounds;
  }

  public get getPublicId(): string {
    return this._publicId;
  }

  public set setPublicId(publicId: string) {
    this._publicId = publicId;
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

  public get getName(): string {
    return this._name;
  }

  public set setName(name: string) {
    this._name = name;
  }

  public get isAvailable(): boolean {
    return this._isAvailable;
  }

  public set setAvailable(isAvailable: boolean) {
    this._isAvailable = isAvailable;
  }

  public get getRounds(): RoundResponse[] {
    return this._rounds;
  }

  public set setRounds(rounds: RoundResponse[]) {
    this._rounds = rounds;
  }

  deserialize(input: any): string {
    return Object.assign(this, input);
  }

  static mapToDriverResponse(apiData: {
    publicId?: string;
    createdAt?: string;
    updatedAt?: string;
    name?: string;
    available?: boolean;
    rounds?: any[];
  }): DriverResponse {
    let roundsResponse: RoundResponse[] = [];
    apiData?.rounds?.forEach((round) => {
      roundsResponse.push(DriverResponse.mapToRoundResponse(round));
    });
    const driverResponse = new DriverResponse(
      apiData.publicId ?? '',
      apiData.createdAt ?? '',
      apiData.updatedAt ?? '',
      apiData.name ?? '',
      apiData.available ?? false,
      roundsResponse,
    );
    return driverResponse;
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
    return `DriverResponse [publicId=${this._publicId}, createdAt=${this._createdAt}, updatedAt=${this._updatedAt} name=${this._name}, isAvailable=${this._isAvailable}]`;
  }
}
