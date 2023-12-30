import { Deserialize } from '../../../../../shared/deserialize/deserialize';
import { RoundResponse } from '../../../round/http/response/round-response.model';

export class DriverRequest implements Deserialize<string> {
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

  public toHTTPJsonBody(): object {
    return {
      name: this.getName,
      available: this.isAvailable,
      rounds: []
    };
  }

  deserialize(input: any): string {
    return Object.assign(this, input);
  }

  toString(): string {
    return `DriverRequest [publicId=${this._publicId}, createdAt=${this._createdAt}, updatedAt=${this._updatedAt} name=${this._name}, isAvailable=${this._isAvailable}]`;
  }
}
