import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DeliveryResponse } from '../../../../../../core/models/delivery/http/response/delivery-response.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delivery-list-detail',
  templateUrl: './delivery-list-detail.component.html',
  styleUrls: ['./delivery-list-detail.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class DeliveryListDetailComponent {
  private _delivery: DeliveryResponse | null = null;
  private _isDialogOpen: boolean = false;
  private _dialogToggled = new EventEmitter<boolean>();

  public get getDelivery(): DeliveryResponse | null {
    return this._delivery;
  }

  @Input()
  public set setDelivery(delivery: DeliveryResponse | null) {
    this._delivery = delivery;
  }

  public get isDialogOpen(): boolean {
    return this._isDialogOpen;
  }

  @Output()
  public get getDialogToggled(): EventEmitter<boolean> {
    return this._dialogToggled;
  }

  public toggleDialog(): void {
    this._isDialogOpen = !this._isDialogOpen;
    this._dialogToggled.emit(this._isDialogOpen);
  }
}
