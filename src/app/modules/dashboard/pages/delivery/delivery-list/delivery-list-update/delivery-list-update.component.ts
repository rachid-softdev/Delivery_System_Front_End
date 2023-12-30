import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DeliveryService } from '../../../../../../core/services/delivery.service';
import { ToastService } from '../../../../../../shared/toast/service/toast.service';
import { ToastPosition, ToastType } from '../../../../../../shared/toast/model/toast.model';
import { DeliveryRequest } from '../../../../../../core/models/delivery/http/request/delivery-request.model';
import { CommonModule } from '@angular/common';
import { DeliveryResponse } from '../../../../../../core/models/delivery/http/response/delivery-response.model';
import { RoundResponse } from 'src/app/core/models/round/http/response/round-response.model';
import { RoundService } from 'src/app/core/services/round.service';
import { RoundPageResponse } from 'src/app/core/models/round/http/response/round-page-response.model';

@Component({
  selector: 'app-delivery-list-update',
  templateUrl: './delivery-list-update.component.html',
  styleUrls: ['./delivery-list-update.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class DeliveryListUpdateComponent implements OnInit, OnDestroy {
  private _delivery: DeliveryResponse | null = null;
  private _isDialogOpen: boolean = false;
  private _dialogToggled = new EventEmitter<boolean>();
  private _updateDeliveryForm: FormGroup;
  private _deliveryUpdatedEvent = new EventEmitter<boolean>();
  private _errorMessage: string | null = null;
  private _isSubmitUpdateDeliveryButtonLoading: boolean = false;
  private _rounds: RoundResponse[] = [];
  private _selectedRound: RoundResponse | null = null;

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  constructor(
    private _fb: FormBuilder,
    private _deliveryService: DeliveryService,
    private _roundService: RoundService,
    private _toastService: ToastService,
  ) {
    this._updateDeliveryForm = this._fb.group({
      pickupAddress: new FormControl('', [Validators.required]),
      dropoffAddress: new FormControl('', [Validators.required]),
    });
    this.loadRounds();
  }

  public get getFormBuilder(): FormBuilder {
    return this._fb;
  }

  public get getDeliveryService(): DeliveryService {
    return this._deliveryService;
  }

  public get getToastService(): ToastService {
    return this._toastService;
  }

  public get getDelivery(): DeliveryResponse | null {
    return this._delivery;
  }

  @Input()
  public set setDelivery(delivery: DeliveryResponse | null) {
    this._delivery = delivery;
    this._updateDeliveryForm.get('pickupAddress')?.setValue(this.getDelivery?.getPickupAddress);
    this._updateDeliveryForm.get('dropoffAddress')?.setValue(this.getDelivery?.getDropoffAddress);
  }

  public get isDialogOpen(): boolean {
    return this._isDialogOpen;
  }

  @Output()
  public get getDialogToggled(): EventEmitter<boolean> {
    return this._dialogToggled;
  }

  @Output()
  public get getDeliveryUpdatedEvent(): EventEmitter<boolean> {
    return this._deliveryUpdatedEvent;
  }

  public get getUpdateDeliveryForm(): FormGroup {
    return this._updateDeliveryForm;
  }

  get errorMessage(): string | null {
    return this._errorMessage;
  }

  public set setErrorMessage(errorMessage: string | null) {
    this._errorMessage = errorMessage;
  }

  public get isSubmitUpdateDeliveryButtonLoading(): boolean {
    return this._isSubmitUpdateDeliveryButtonLoading;
  }

  public set setIsSubmitUpdateDeliveryButtonLoading(isSubmitUpdateDeliveryButtonLoading: boolean) {
    this._isSubmitUpdateDeliveryButtonLoading = isSubmitUpdateDeliveryButtonLoading;
  }

  public get getRounds(): RoundResponse[] {
    return this._rounds;
  }

  public set setRounds(rounds: RoundResponse[]) {
    this._rounds = rounds;
  }

  public get getSelectedRound(): RoundResponse | null {
    return this._selectedRound;
  }

  public set setSelectedRound(selectedRound: RoundResponse | null) {
    this._selectedRound = selectedRound;
  }

  private loadRounds(): void {
    this._roundService.getAllRounds().subscribe((response: RoundResponse[]) => {
      this.setRounds = response?.map((apiData: any) => RoundResponse.mapToRoundResponse(apiData)) || [];
    });
  }

  public toggleDialog(): void {
    this._isDialogOpen = !this._isDialogOpen;
    this._dialogToggled.emit(this._isDialogOpen);
  }

  public get getSelectedRounds(): RoundResponse[] {
    const selectedRounds: RoundResponse[] = [];
    const roundsFormArray = this._updateDeliveryForm.get('rounds') as FormArray;
    roundsFormArray.controls.forEach((control, index) => {
      if (control.value) {
        selectedRounds.push(this.getRounds[index]);
      }
    });
    return selectedRounds;
  }

  public onCheckboxRoundsChange(index: number) {
    const roundsFormArray = this._updateDeliveryForm.get('rounds') as FormArray;
    const checkboxControl = roundsFormArray.at(index);
    checkboxControl.setValue(!checkboxControl.value);
  }

  public onSubmitUpdateDelivery(): void {
    this._isSubmitUpdateDeliveryButtonLoading = true;
    if (this._updateDeliveryForm.invalid) {
      this._isSubmitUpdateDeliveryButtonLoading = false;
      return;
    }
    const createdAt: string = new Date().toISOString().toString(),
      updatedAt = createdAt;
    const newDeliveryRequest: DeliveryRequest = new DeliveryRequest(
      createdAt,
      updatedAt,
      this.getDelivery?.getPublicId,
      this._updateDeliveryForm.get('pickupAddress')?.value,
      this._updateDeliveryForm.get('dropoffAddress')?.value,
      this.getSelectedRound
    );

    this._deliveryService.updateDelivery(this.getDelivery?.getPublicId ?? '', newDeliveryRequest).subscribe({
      next: () => {
        this._updateDeliveryForm.reset();
        this._errorMessage = null;
        this._isSubmitUpdateDeliveryButtonLoading = false;
        this.toggleDialog();
        this._toastService.show(
          'Mis à jour de la livraison',
          'La livraison a été mis à jour avec succès',
          5,
          ToastType.Success,
          ToastPosition.BottomRight,
        );
        this.getDeliveryUpdatedEvent.emit(true);
      },
      error: (error) => {
        console.log(error);
        if (error.status === 404) {
          this._errorMessage = 'Erreur : Ressource non trouvée (' + error?.status + ') - ' + error?.error?.message;
        } else {
          this._errorMessage =
            "Une erreur s'est produite lors de la mis à jour de la livraison : (" +
            error?.status +
            ') - ' +
            error?.error?.message;
        }
        this._isSubmitUpdateDeliveryButtonLoading = false;
        this._toastService.show('Erreur', this._errorMessage, 5, ToastType.Error, ToastPosition.BottomRight);
        this.getDeliveryUpdatedEvent.emit(false);
      },
    });
  }
}
