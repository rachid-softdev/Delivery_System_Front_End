import { Deserialize } from '../../../shared/deserialize/deserialize';
import { RoundResponse } from '../round/http/response/round-response.model';

export class Driver implements Deserialize<string> {
  private _publicId: string;
  private _createdAt: string;
  private _updatedAt: string;
  private _name: string;
  private _isAvailable: boolean;
  private _rounds: RoundResponse[];
  private _deliveriesCounter: number = 0;

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
    this.updateDeliveriesCounter();
  }

  private updateDeliveriesCounter(): void {
    this.getRounds.forEach((round) => {
      this._deliveriesCounter += round.getDeliveries.length;
    });
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
    this.updateDeliveriesCounter();
  }

  public get getDeliveriesCounter(): number {
    return this._deliveriesCounter;
  }

  public set setDeliveriesCounter(deliveriesCounter: number) {
    this._deliveriesCounter = deliveriesCounter;
  }

  deserialize(input: any): string {
    return Object.assign(this, input);
  }

  static mapToDriver(apiData: {
    publicId?: string;
    createdAt?: string;
    updatedAt?: string;
    name?: string;
    available?: boolean;
    rounds?: any[];
  }): Driver {
    let roundsResponse: RoundResponse[] = [];
    apiData?.rounds?.forEach((round) => {
      roundsResponse.push(RoundResponse.mapToRoundResponse(round));
    });
    const driver = new Driver(
      apiData.publicId ?? '',
      apiData.createdAt ?? '',
      apiData.updatedAt ?? '',
      apiData.name ?? '',
      apiData.available ?? false,
      roundsResponse,
    );
    return driver;
  }

  toString(): string {
    return `Driver [publicId=${this._publicId}, createdAt=${this._createdAt}, updatedAt=${this._updatedAt} name=${this._name}, isAvailable=${this._isAvailable}]`;
  }
}
