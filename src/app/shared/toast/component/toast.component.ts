import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastModel, ToastType } from '../model/toast.model';
import { ToastService } from '../service/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ToastComponent implements OnInit, OnDestroy {
  public ToastType = ToastType;

  private _toastModel: ToastModel = new ToastModel();

  private $subscriptions: Subscription;

  constructor(private _toastService: ToastService) {
    this.$subscriptions = this._toastService.$toastState.subscribe(
      (toastModel: ToastModel) => {
        this._toastModel = toastModel;
      }
    );
  }

  public get getToastModel(): ToastModel {
    return this._toastModel;
  }

  public setToastModel(toastModel: ToastModel) {
    this._toastModel = toastModel;
  }

  public closeToast(): void {
    this._toastModel.isVisible = false;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.$subscriptions.unsubscribe();
  }
}
