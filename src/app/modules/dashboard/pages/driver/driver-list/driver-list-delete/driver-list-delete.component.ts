import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Driver } from '../../../../../../core/models/driver/driver.model';
import { DriverService } from '../../../../../../core/services/driver.service';
import { ToastService } from '../../../../../../shared/toast/service/toast.service';
import { ToastPosition, ToastType } from '../../../../../../shared/toast/model/toast.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-driver-list-delete',
  templateUrl: './driver-list-delete.component.html',
  styleUrls: ['./driver-list-delete.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class DriverListDeleteComponent {
  private _driver: Driver | null = null;
  private _isDialogOpen: boolean = false;
  private _dialogToggled = new EventEmitter<boolean>();
  private _driverDeletedEvent = new EventEmitter<boolean>();
  private _errorMessage: string | null = null;
  private _isSubmitDeleteDriverButtonLoading: boolean = false;

  constructor(private driverService: DriverService, private _toastService: ToastService) {}

  public get getDriver(): Driver | null {
    return this._driver;
  }

  @Input()
  public set setDriver(driver: Driver | null) {
    this._driver = driver;
  }

  public get isDialogOpen(): boolean {
    return this._isDialogOpen;
  }

  @Output()
  public get getDialogToggled(): EventEmitter<boolean> {
    return this._dialogToggled;
  }

  @Output()
  public get getDriverDeletedEvent(): EventEmitter<boolean> {
    return this._driverDeletedEvent;
  }

  public get errorMessage(): string | null {
    return this._errorMessage;
  }

  public set setErrorMessage(errorMessage: string | null) {
    this._errorMessage = errorMessage;
  }

  public get isSubmitDeleteDriverButtonLoading(): boolean {
    return this._isSubmitDeleteDriverButtonLoading;
  }

  public set setIsSubmitDeleteDriverButtonLoading(isSubmitDeleteDriverButtonLoading: boolean) {
    this._isSubmitDeleteDriverButtonLoading = isSubmitDeleteDriverButtonLoading;
  }

  public toggleDialog(): void {
    this._isDialogOpen = !this._isDialogOpen;
    this._dialogToggled.emit(this._isDialogOpen);
  }

  public confirmDelete(): void {
    if (this._driver) {
      this._isSubmitDeleteDriverButtonLoading = true;
      this.driverService.deleteDriver(this._driver.getPublicId).subscribe({
        next: () => {
          this._errorMessage = null;
          this._isSubmitDeleteDriverButtonLoading = false;
          this.toggleDialog();
          this._toastService.show(
            'Suppression du livreur',
            'Le livreur a été supprimé avec succès',
            5,
            ToastType.Success,
            ToastPosition.BottomRight,
          );
          this.getDriverDeletedEvent.emit(true);
        },
        error: (error) => {
          if (error.status === 404) {
            this._errorMessage = 'Erreur : Ressource non trouvée (' + error?.status + ') - ' + error?.error?.message;
          } else {
            this._errorMessage =
              "Une erreur s'est produite lors de la suppression du livreur : (" +
              error?.status +
              ') - ' +
              error?.error?.message;
          }
          this._isSubmitDeleteDriverButtonLoading = false;
          this._toastService.show('Erreur', this._errorMessage, 5, ToastType.Error, ToastPosition.BottomRight);
          this.getDriverDeletedEvent.emit(false);
        },
      });
    }
  }

  public cancelDelete(): void {
    this.toggleDialog();
  }
}
