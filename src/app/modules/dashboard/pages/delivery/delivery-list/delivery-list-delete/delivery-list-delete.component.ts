import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DeliveryService } from '../../../../../../core/services/delivery.service';
import { ToastService } from '../../../../../../shared/toast/service/toast.service';
import { ToastPosition, ToastType } from '../../../../../../shared/toast/model/toast.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DeliveryResponse } from '../../../../../../core/models/delivery/http/response/delivery-response.model';

@Component({
  selector: 'app-delivery-list-delete',
  templateUrl: './delivery-list-delete.component.html',
  styleUrls: ['./delivery-list-delete.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class DeliveryListDeleteComponent {
  private _delivery: DeliveryResponse | null = null;
  private _isDialogOpen: boolean = false;
  private _dialogToggled = new EventEmitter<boolean>();
  private _deliveryDeletedEvent = new EventEmitter<boolean>();
  private _errorMessage: string | null = null;
  private _isSubmitDeleteDeliveryButtonLoading: boolean = false;

  constructor(private deliveryService: DeliveryService, private _toastService: ToastService) {}

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

  @Output()
  public get getDeliveryDeletedEvent(): EventEmitter<boolean> {
    return this._deliveryDeletedEvent;
  }

  public get errorMessage(): string | null {
    return this._errorMessage;
  }

  public set setErrorMessage(errorMessage: string | null) {
    this._errorMessage = errorMessage;
  }

  public get isSubmitDeleteDeliveryButtonLoading(): boolean {
    return this._isSubmitDeleteDeliveryButtonLoading;
  }

  public set setIsSubmitDeleteDeliveryButtonLoading(isSubmitDeleteDeliveryButtonLoading: boolean) {
    this._isSubmitDeleteDeliveryButtonLoading = isSubmitDeleteDeliveryButtonLoading;
  }

  public toggleDialog(): void {
    this._isDialogOpen = !this._isDialogOpen;
    this._dialogToggled.emit(this._isDialogOpen);
  }

  public confirmDelete(): void {
    if (this._delivery) {
      this._isSubmitDeleteDeliveryButtonLoading = true;
      this.deliveryService.deleteDelivery(this._delivery.getPublicId).subscribe({
        next: () => {
          this._errorMessage = null;
          this._isSubmitDeleteDeliveryButtonLoading = false;
          this.toggleDialog();
          this._toastService.show(
            'Suppression de la livraison',
            'La livraison a été supprimé avec succès',
            5,
            ToastType.Success,
            ToastPosition.BottomRight,
          );
          this.getDeliveryDeletedEvent.emit(true);
        },
        error: (error) => {
          if (error.status === 404) {
            this._errorMessage = 'Erreur : Ressource non trouvée (' + error?.status + ') - ' + error?.error?.message;
          } else {
            this._errorMessage =
              "Une erreur s'est produite lors de la suppression de la livraison : (" +
              error?.status +
              ') - ' +
              error?.error?.message;
          }
          this._isSubmitDeleteDeliveryButtonLoading = false;
          this._toastService.show('Erreur', this._errorMessage, 5, ToastType.Error, ToastPosition.BottomRight);
          this.getDeliveryDeletedEvent.emit(false);
        },
      });
    }
  }

  public cancelDelete(): void {
    this.toggleDialog();
  }
}
