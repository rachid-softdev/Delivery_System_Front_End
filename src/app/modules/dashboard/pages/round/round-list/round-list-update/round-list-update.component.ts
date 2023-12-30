import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoundService } from '../../../../../../core/services/round.service';
import { ToastService } from '../../../../../../shared/toast/service/toast.service';
import { ToastPosition, ToastType } from '../../../../../../shared/toast/model/toast.model';
import { RoundRequest } from '../../../../../../core/models/round/http/request/round-request.model';
import { RoundResponse } from '../../../../../../core/models/round/http/response/round-response.model';
import { DeliveryResponse } from 'src/app/core/models/delivery/http/response/delivery-response.model';
import { DeliveryService } from 'src/app/core/services/delivery.service';
import { DriverService } from '../../../../../../core/services/driver.service';
import { DriverResponse } from '../../../../../../core/models/driver/http/response/driver-response.model';

@Component({
  selector: 'app-round-list-update',
  templateUrl: './round-list-update.component.html',
  styleUrls: ['./round-list-update.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [DeliveryService, DriverService],
})
export class RoundListUpdateComponent implements OnInit, OnDestroy {
  private _round: RoundResponse | null = null;
  private _isDialogOpen: boolean = false;
  private _dialogToggled = new EventEmitter<boolean>();
  private _updateRoundForm: FormGroup;
  private _roundUpdatedEvent = new EventEmitter<boolean>();
  private _errorMessage: string | null = null;
  private _isSubmitUpdateRoundButtonLoading: boolean = false;
  private _drivers: DriverResponse[] = [];
  private _selectedDriver: DriverResponse | null = null;
  private _deliveries: DeliveryResponse[] = [];

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  constructor(
    private _fb: FormBuilder,
    private _roundService: RoundService,
    private _driverService: DriverService,
    private _deliveryService: DeliveryService,
    private _toastService: ToastService,
  ) {
    this.loadDrivers();
    this.loadDeliveries();
    this._updateRoundForm = this._fb.group({
      name: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^\S/)]),
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
      drivers: this._fb.array([]),
      deliveries: this._fb.array([]),
    });
  }

  public get getDrivers(): DriverResponse[] {
    return this._drivers;
  }

  public set setDrivers(drivers: DriverResponse[]) {
    this._drivers = drivers;
  }

  private loadDrivers(): void {
    this._driverService.getAllDrivers().subscribe((response: DriverResponse[]) => {
      this.setDrivers = response?.map((apiData: any) => DriverResponse.mapToDriverResponse(apiData)) || [];
      this.initializeDriversCheckboxes();
    });
  }

  public get getDeliveries(): DeliveryResponse[] {
    return this._deliveries;
  }

  public set setDeliveries(deliveries: DeliveryResponse[]) {
    this._deliveries = deliveries;
  }

  private loadDeliveries(): void {
    this._deliveryService.getAllDeliveries().subscribe((response: DeliveryResponse[]) => {
      this.setDeliveries = response?.map((apiData: any) => DeliveryResponse.mapToDeliveryResponse(apiData)) || [];
      this.initializeDeliveriesCheckboxes();
    });
  }

  private initializeDriversCheckboxes() {
    this.getDrivers.forEach((driver) => {
      const checkboxControl = this._fb.control(false);
      (this._updateRoundForm.get('drivers') as any).push(checkboxControl);
    });
  }

  private initializeDeliveriesCheckboxes() {
    this.getDeliveries.forEach((delivery) => {
      const checkboxControl = this._fb.control(false);
      (this._updateRoundForm.get('deliveries') as any).push(checkboxControl);
    });
  }

  public get getFormBuilder(): FormBuilder {
    return this._fb;
  }

  public get getRoundService(): RoundService {
    return this._roundService;
  }

  public get getToastService(): ToastService {
    return this._toastService;
  }

  public get getRound(): RoundResponse | null {
    return this._round;
  }

  @Input()
  public set setRound(round: RoundResponse | null) {
    this._round = round;
    if (!this._round) return;
    this._updateRoundForm.get('name')?.setValue(this.getRound?.getName);
    this._updateRoundForm
      .get('startDate')
      ?.setValue(new Date(this.getRound?.getStartDate ?? '').toLocaleDateString('en-CA'));
    this._updateRoundForm
      .get('endDate')
      ?.setValue(new Date(this.getRound?.getEndDate ?? '').toLocaleDateString('en-CA'));
    // Mis à jour du radio-button avec le driver appartenant à ce round
    const roundDriver = this._round.getDriver;
    if (roundDriver) {
      const driversFormArray: FormArray<any> = this._updateRoundForm.get('drivers') as FormArray;
      this.getDrivers.forEach((driver, index) => {
        const isRoundDriver = roundDriver.getPublicId === driver.getPublicId;
        driversFormArray.at(index)?.setValue(isRoundDriver);
      });
    }
    // Mis à jour des checkboxes avec les deliveries appartenant à ce round
    const roundDeliveries: DeliveryResponse[] = this._round.getDeliveries;
    const deliveriesFormArray: FormArray<any> = this._updateRoundForm.get('deliveries') as FormArray;
    this.getDeliveries.forEach((delivery, index) => {
      const isDeliveryInRound = roundDeliveries.some((roundDelivery) => {
        return roundDelivery.getPublicId === delivery.getPublicId;
      });
      deliveriesFormArray.at(index)?.setValue(isDeliveryInRound);
    });
  }

  public get isDialogOpen(): boolean {
    return this._isDialogOpen;
  }

  @Output()
  public get getDialogToggled(): EventEmitter<boolean> {
    return this._dialogToggled;
  }

  @Output()
  public get getRoundUpdatedEvent(): EventEmitter<boolean> {
    return this._roundUpdatedEvent;
  }

  public get getUpdateRoundForm(): FormGroup {
    return this._updateRoundForm;
  }

  get errorMessage(): string | null {
    return this._errorMessage;
  }

  public set setErrorMessage(errorMessage: string | null) {
    this._errorMessage = errorMessage;
  }

  public get isSubmitUpdateRoundButtonLoading(): boolean {
    return this._isSubmitUpdateRoundButtonLoading;
  }

  public set setIsSubmitUpdateRoundButtonLoading(isSubmitUpdateRoundButtonLoading: boolean) {
    this._isSubmitUpdateRoundButtonLoading = isSubmitUpdateRoundButtonLoading;
  }

  public get getSelectedDriver(): DriverResponse | null {
    return this._selectedDriver;
  }

  public set setSelectedDriver(driver: DriverResponse | null) {
    this._selectedDriver = driver;
  }

  public toggleDialog(): void {
    this._isDialogOpen = !this._isDialogOpen;
    this._dialogToggled.emit(this._isDialogOpen);
  }

  public resetForm(): void {
    this._errorMessage = null;
    this._updateRoundForm.reset();
  }

  public get getSelectedDeliveries(): DeliveryResponse[] {
    const selectedDeliveries: DeliveryResponse[] = [];
    const deliveriesFormArray = this._updateRoundForm.get('deliveries') as FormArray;
    deliveriesFormArray.controls.forEach((control, index) => {
      if (control.value) {
        selectedDeliveries.push(this.getDeliveries[index]);
      }
    });
    return selectedDeliveries;
  }

  public onCheckboxDeliveriesChange(index: number) {
    const deliveriesFormArray = this._updateRoundForm.get('deliveries') as FormArray;
    const checkboxControl = deliveriesFormArray.at(index);
    checkboxControl.setValue(!checkboxControl.value);
  }

  public isDeliverySelected(delivery: DeliveryResponse): boolean {
    console.log()
    return (
      this.getRound && this.getRound?.getDeliveries?.length > 0 &&
      this.getRound?.getDeliveries?.some(deliveryRound => 
        delivery?.getPublicId === deliveryRound?.getPublicId
      )
    ) ?? false;
  }

  public onSubmitUpdateRound(): void {
    this._isSubmitUpdateRoundButtonLoading = true;
    if (this._updateRoundForm.invalid) {
      this._isSubmitUpdateRoundButtonLoading = false;
      return;
    }
    const createdAt: string = new Date().toISOString().toString(),
      updatedAt = createdAt;

    const startDateValue = this._updateRoundForm.get('startDate')?.value;
    const endDateValue = this._updateRoundForm.get('endDate')?.value;

    function isValidDate(dateString: string): boolean {
      const regexDate = /^\d{4}-\d{2}-\d{2}$/;
      return regexDate.test(dateString) && !isNaN(Date.parse(dateString));
    }
    const startDate = startDateValue ? (isValidDate(startDateValue) ? new Date(startDateValue) : null) : null;
    const endDate = endDateValue ? (isValidDate(endDateValue) ? new Date(endDateValue) : null) : null;

    console.log(this.getSelectedDriver)
        console.log(this.getSelectedDeliveries)


    const newRoundRequest: RoundRequest = new RoundRequest(
      createdAt,
      updatedAt,
      '',
      this._updateRoundForm.get('name')?.value,
      startDate?.toISOString() ?? '',
      endDate?.toISOString() ?? '',
      this.getSelectedDriver,
      this.getSelectedDeliveries,
    );

    this._roundService.updateRound(this.getRound?.getPublicId ?? '', newRoundRequest).subscribe({
      next: () => {
        this._updateRoundForm.reset();
        this._errorMessage = null;
        this._isSubmitUpdateRoundButtonLoading = false;
        this.toggleDialog();
        this._toastService.show(
          'Mis à jour de la tournée',
          'La tournée a été mis à jour avec succès',
          5,
          ToastType.Success,
          ToastPosition.BottomRight,
        );
        this.getRoundUpdatedEvent.emit(true);
      },
      error: (error) => {
        console.log(error);
        if (error.status === 404) {
          this._errorMessage = 'Erreur : Ressource non trouvée (' + error?.status + ') - ' + error?.error?.message;
        } else {
          this._errorMessage =
            "Une erreur s'est produite lors de la création de la tournée : (" +
            error?.status +
            ') - ' +
            error?.error?.message;
        }
        this._isSubmitUpdateRoundButtonLoading = false;
        this._toastService.show('Erreur', this._errorMessage, 5, ToastType.Error, ToastPosition.BottomRight);
        this.getRoundUpdatedEvent.emit(false);
      },
    });
  }
}
