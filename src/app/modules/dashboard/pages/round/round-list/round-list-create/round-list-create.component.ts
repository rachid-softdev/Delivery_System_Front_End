import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoundService } from '../../../../../../core/services/round.service';
import { ToastService } from '../../../../../../shared/toast/service/toast.service';
import { ToastPosition, ToastType } from '../../../../../../shared/toast/model/toast.model';
import { RoundRequest } from '../../../../../../core/models/round/http/request/round-request.model';
import { DeliveryService } from '../../../../../../core/services/delivery.service';
import { DeliveryResponse } from '../../../../../../core/models/delivery/http/response/delivery-response.model';
import { DriverResponse } from '../../../../../../core/models/driver/http/response/driver-response.model';
import { DriverService } from '../../../../../../core/services/driver.service';

@Component({
  selector: 'app-round-list-create',
  templateUrl: './round-list-create.component.html',
  styleUrls: ['./round-list-create.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [DeliveryService, DriverService],
})
export class RoundListCreateComponent implements OnInit, OnDestroy {
  private _isDialogOpen: boolean = false;
  private _dialogToggled = new EventEmitter<boolean>();
  private _createRoundForm: FormGroup;
  private _roundCreatedEvent = new EventEmitter<boolean>();
  private _errorMessage: string | null = null;
  private _isSubmitCreateRoundButtonLoading: boolean = false;
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
    this._createRoundForm = this._fb.group({
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
      this.initializeDriversCheckboxes();
      this.initializeDeliveriesCheckboxes();
    });
  }

  private initializeDriversCheckboxes() {
    this.getDrivers.forEach((driver) => {
      const radioControl = this._fb.control(false);
      (this._createRoundForm.get('drivers') as any).push(radioControl);
    });
  }

  private initializeDeliveriesCheckboxes() {
    this.getDeliveries.forEach((delivery) => {
      const checkboxControl = this._fb.control(false);
      (this._createRoundForm.get('deliveries') as any).push(checkboxControl);
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

  public get isDialogOpen(): boolean {
    return this._isDialogOpen;
  }

  @Output()
  public get getDialogToggled(): EventEmitter<boolean> {
    return this._dialogToggled;
  }

  @Output()
  public get getRoundCreatedEvent(): EventEmitter<boolean> {
    return this._roundCreatedEvent;
  }

  public get getCreateRoundForm(): FormGroup {
    return this._createRoundForm;
  }

  get errorMessage(): string | null {
    return this._errorMessage;
  }

  public set setErrorMessage(errorMessage: string | null) {
    this._errorMessage = errorMessage;
  }

  public get isSubmitCreateRoundButtonLoading(): boolean {
    return this._isSubmitCreateRoundButtonLoading;
  }

  public set setIsSubmitCreateRoundButtonLoading(isSubmitCreateRoundButtonLoading: boolean) {
    this._isSubmitCreateRoundButtonLoading = isSubmitCreateRoundButtonLoading;
  }

  public get getSelectedDriver(): DriverResponse | null {
    return this._selectedDriver;
  }

  public set setSelectedDriver(driver: DriverResponse | null) {
    this._selectedDriver = driver;
  }

  public toggleDialog(): void {
    this.resetForm();
    this._isDialogOpen = !this._isDialogOpen;
    this._dialogToggled.emit(this._isDialogOpen);
  }

  public resetForm(): void {
    this._errorMessage = null;
    this._createRoundForm.reset();
  }

  public get getSelectedDeliveries(): DeliveryResponse[] {
    const selectedDeliveries: DeliveryResponse[] = [];
    const deliveriesFormArray = this._createRoundForm.get('deliveries') as FormArray;
    deliveriesFormArray.controls.forEach((control, index) => {
      if (control.value) {
        selectedDeliveries.push(this.getDeliveries[index]);
      }
    });
    return selectedDeliveries;
  }

  public onCheckboxDeliveriesChange(index: number) {
    const deliveriesFormArray = this._createRoundForm.get('deliveries') as FormArray;
    const checkboxControl = deliveriesFormArray.at(index);
    checkboxControl.setValue(!checkboxControl.value);
  }

  public onSubmitCreateRound(): void {
    this._isSubmitCreateRoundButtonLoading = true;
    if (this._createRoundForm.invalid) {
      this._isSubmitCreateRoundButtonLoading = false;
      return;
    }
    const createdAt: string = new Date().toISOString().toString(),
      updatedAt = createdAt;

    const startDateValue = this._createRoundForm.get('startDate')?.value;
    const endDateValue = this._createRoundForm.get('endDate')?.value;

    function isValidDate(dateString: string): boolean {
      const regexDate = /^\d{4}-\d{2}-\d{2}$/;
      return regexDate.test(dateString) && !isNaN(Date.parse(dateString));
    }
    const startDate = startDateValue ? (isValidDate(startDateValue) ? new Date(startDateValue) : null) : null;
    const endDate = endDateValue ? (isValidDate(endDateValue) ? new Date(endDateValue) : null) : null;

    const newRoundRequest: RoundRequest = new RoundRequest(
      createdAt,
      updatedAt,
      '',
      this._createRoundForm.get('name')?.value,
      startDate?.toISOString() ?? '',
      endDate?.toISOString() ?? '',
      this.getSelectedDriver,
      this.getSelectedDeliveries,
    );

    this._roundService.createRound(newRoundRequest).subscribe({
      next: () => {
        this._createRoundForm.reset();
        this._errorMessage = null;
        this._isSubmitCreateRoundButtonLoading = false;
        this.toggleDialog();
        this._toastService.show(
          'Nouvelle tournée',
          'La tournée a été crée avec succès',
          5,
          ToastType.Success,
          ToastPosition.BottomRight,
        );
        this.getRoundCreatedEvent.emit(true);
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
        this._isSubmitCreateRoundButtonLoading = false;
        this._toastService.show('Erreur', this._errorMessage, 5, ToastType.Error, ToastPosition.BottomRight);
        this.getRoundCreatedEvent.emit(false);
      },
    });
  }
}
