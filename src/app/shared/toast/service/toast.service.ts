import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastModel, ToastType, ToastPosition } from '../model/toast.model';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  
  private readonly _DEFAULT_DURATION_SECONDS : number = 5;

  public getDefaultDurationSeconds(): number {
    return this._DEFAULT_DURATION_SECONDS;
  }

  $toastState = new BehaviorSubject<ToastModel>(new ToastModel(false));

  public show(
    title: string,
    message: string,
    seconds: number = 0,
    type: ToastType = ToastType.Info,
    position: ToastPosition = ToastPosition.TopRight
  ) {
    if (seconds <= 0) {
      seconds = this.getDefaultDurationSeconds();
    }
    const toast = new ToastModel(true);
    toast.setTitle = title;
    toast.setMessage = message;
    toast.setPosition = position;
    toast.setType = type;
    this.$toastState.next(toast);
    setTimeout(
      () => this.$toastState.next(new ToastModel(false)),
      seconds * 1000
    );
  }
}
