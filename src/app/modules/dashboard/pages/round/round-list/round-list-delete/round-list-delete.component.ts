import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RoundService } from '../../../../../../core/services/round.service';
import { ToastService } from '../../../../../../shared/toast/service/toast.service';
import { ToastPosition, ToastType } from '../../../../../../shared/toast/model/toast.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RoundResponse } from '../../../../../../core/models/round/http/response/round-response.model';

@Component({
  selector: 'app-round-list-delete',
  templateUrl: './round-list-delete.component.html',
  styleUrls: ['./round-list-delete.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class RoundListDeleteComponent {
  private _round: RoundResponse | null = null;
  private _isDialogOpen: boolean = false;
  private _dialogToggled = new EventEmitter<boolean>();
  private _roundDeletedEvent = new EventEmitter<boolean>();
  private _errorMessage: string | null = null;
  private _isSubmitDeleteRoundButtonLoading: boolean = false;

  constructor(private roundService: RoundService, private _toastService: ToastService) {}

  public get getRound(): RoundResponse | null {
    return this._round;
  }

  @Input()
  public set setRound(round: RoundResponse | null) {
    this._round = round;
  }

  public get isDialogOpen(): boolean {
    return this._isDialogOpen;
  }

  @Output()
  public get getDialogToggled(): EventEmitter<boolean> {
    return this._dialogToggled;
  }

  @Output()
  public get getRoundDeletedEvent(): EventEmitter<boolean> {
    return this._roundDeletedEvent;
  }

  public get errorMessage(): string | null {
    return this._errorMessage;
  }

  public set setErrorMessage(errorMessage: string | null) {
    this._errorMessage = errorMessage;
  }

  public get isSubmitDeleteRoundButtonLoading(): boolean {
    return this._isSubmitDeleteRoundButtonLoading;
  }

  public set setIsSubmitDeleteRoundButtonLoading(isSubmitDeleteRoundButtonLoading: boolean) {
    this._isSubmitDeleteRoundButtonLoading = isSubmitDeleteRoundButtonLoading;
  }

  public toggleDialog(): void {
    this._isDialogOpen = !this._isDialogOpen;
    this._dialogToggled.emit(this._isDialogOpen);
  }

  public confirmDelete(): void {
    if (this._round) {
      this._isSubmitDeleteRoundButtonLoading = true;
      this.roundService.deleteRound(this._round.getPublicId).subscribe({
        next: () => {
          this._errorMessage = null;
          this._isSubmitDeleteRoundButtonLoading = false;
          this.toggleDialog();
          this._toastService.show(
            'Suppression de la tournée',
            'La tournée a été supprimé avec succès',
            5,
            ToastType.Success,
            ToastPosition.BottomRight,
          );
          this.getRoundDeletedEvent.emit(true);
        },
        error: (error) => {
          if (error.status === 404) {
            this._errorMessage = 'Erreur : Ressource non trouvée (' + error?.status + ') - ' + error?.error?.message;
          } else {
            this._errorMessage =
              "Une erreur s'est produite lors de la suppression de la tournée : (" +
              error?.status +
              ') - ' +
              error?.error?.message;
          }
          this._isSubmitDeleteRoundButtonLoading = false;
          this._toastService.show('Erreur', this._errorMessage, 5, ToastType.Error, ToastPosition.BottomRight);
          this.getRoundDeletedEvent.emit(false);
        },
      });
    }
  }

  public cancelDelete(): void {
    this.toggleDialog();
  }
}
