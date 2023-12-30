export class ToastModel {

  private _isVisible: boolean = false;
  private _title: string = '';
  private _message: string = '';
  private _position: ToastPosition = ToastPosition.TopRight;
  private _type: ToastType = ToastType.Info;

  constructor(isVisible: boolean = false, title: string = '', message: string = '', position = ToastPosition.BottomRight, type: ToastType = ToastType.Info) {
    this._isVisible = isVisible;
		this._title = title;
		this._message = message;
		this._position = position;
		this._type = type;
  }

  public get isVisible(): boolean {
    return this._isVisible;
  }

  public set isVisible(value: boolean) {
    this._isVisible = value;
  }

  public get getTitle(): string {
    return this._title;
  }

  public set setTitle(value: string) {
    this._title = value;
  }

  public get getMessage(): string {
    return this._message;
  }

  public set setMessage(value: string) {
    this._message = value;
  }

  public get getPosition(): ToastPosition {
    return this._position;
  }

  public set setPosition(value: ToastPosition) {
    this._position = value;
  }

  public get getType(): ToastType {
    return this._type;
  }

  public set setType(value: ToastType) {
    this._type = value;
  }
}

export enum ToastType {
  Info = 'info',
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
}

export enum ToastPosition {
  TopLeft = 'fixed top-5 left-5',
  TopRight = 'fixed top-5 right-5',
  BottomLeft = 'fixed bottom-5 left-5',
  BottomRight = 'fixed bottom-5 right-5',
}
