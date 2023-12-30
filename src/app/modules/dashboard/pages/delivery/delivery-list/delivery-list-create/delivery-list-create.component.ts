import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DeliveryService } from '../../../../../../core/services/delivery.service';
import { ToastService } from '../../../../../../shared/toast/service/toast.service';
import { ToastPosition, ToastType } from '../../../../../../shared/toast/model/toast.model';
import { DeliveryRequest } from '../../../../../../core/models/delivery/http/request/delivery-request.model';
import { CommonModule } from '@angular/common';
import { RoundResponse } from 'src/app/core/models/round/http/response/round-response.model';
import { RoundService } from 'src/app/core/services/round.service';
import { RoundPageResponse } from 'src/app/core/models/round/http/response/round-page-response.model';

@Component({
  selector: 'app-delivery-list-create',
  templateUrl: './delivery-list-create.component.html',
  styleUrls: ['./delivery-list-create.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class DeliveryListCreateComponent implements OnInit, OnDestroy {
  private _isDialogOpen: boolean = false;
  private _dialogToggled = new EventEmitter<boolean>();
  private _createDeliveryForm: FormGroup;
  private _deliveryCreatedEvent = new EventEmitter<boolean>();
  private _errorMessage: string | null = null;
  private _isSubmitCreateDeliveryButtonLoading: boolean = false;
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
    this._createDeliveryForm = this._fb.group({
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

  public get isDialogOpen(): boolean {
    return this._isDialogOpen;
  }

  @Output()
  public get getDialogToggled(): EventEmitter<boolean> {
    return this._dialogToggled;
  }

  @Output()
  public get getDeliveryCreatedEvent(): EventEmitter<boolean> {
    return this._deliveryCreatedEvent;
  }

  public get getCreateDeliveryForm(): FormGroup {
    return this._createDeliveryForm;
  }

  get errorMessage(): string | null {
    return this._errorMessage;
  }

  public set setErrorMessage(errorMessage: string | null) {
    this._errorMessage = errorMessage;
  }

  public get isSubmitCreateDeliveryButtonLoading(): boolean {
    return this._isSubmitCreateDeliveryButtonLoading;
  }

  public set setIsSubmitCreateDeliveryButtonLoading(isSubmitCreateDeliveryButtonLoading: boolean) {
    this._isSubmitCreateDeliveryButtonLoading = isSubmitCreateDeliveryButtonLoading;
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
    this.resetForm();
    this._isDialogOpen = !this._isDialogOpen;
    this._dialogToggled.emit(this._isDialogOpen);
  }

  public resetForm(): void {
    this._errorMessage = null;
    this._createDeliveryForm.reset();
  }

  public onSubmitCreateDelivery(): void {
    this._isSubmitCreateDeliveryButtonLoading = true;
    if (this._createDeliveryForm.invalid) {
      this._isSubmitCreateDeliveryButtonLoading = false;
      return;
    }
    const createdAt: string = new Date().toISOString().toString(),
      updatedAt = createdAt;
    const newDeliveryRequest: DeliveryRequest = new DeliveryRequest(
      createdAt,
      updatedAt,
      '',
      this._createDeliveryForm.get('pickupAddress')?.value,
      this._createDeliveryForm.get('dropoffAddress')?.value,
      this.getSelectedRound,
    );

    this._deliveryService.createDelivery(newDeliveryRequest).subscribe({
      next: () => {
        this._createDeliveryForm.reset();
        this._errorMessage = null;
        this._isSubmitCreateDeliveryButtonLoading = false;
        this.toggleDialog();
        this._toastService.show(
          'Nouvelle livraison',
          'La livraison a été crée avec succès',
          5,
          ToastType.Success,
          ToastPosition.BottomRight,
        );
        this.getDeliveryCreatedEvent.emit(true);
      },
      error: (error) => {
        console.log(error);
        if (error.status === 404) {
          this._errorMessage = 'Erreur : Ressource non trouvée (' + error?.status + ') - ' + error?.error?.message;
        } else {
          this._errorMessage =
            "Une erreur s'est produite lors de la création de la livraison : (" +
            error?.status +
            ') - ' +
            error?.error?.message;
        }
        this._isSubmitCreateDeliveryButtonLoading = false;
        this._toastService.show('Erreur', this._errorMessage, 5, ToastType.Error, ToastPosition.BottomRight);
        this.getDeliveryCreatedEvent.emit(false);
      },
    });
  }
}
