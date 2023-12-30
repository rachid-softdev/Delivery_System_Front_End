import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Driver } from '../../../../../../core/models/driver/driver.model';
import { DriverService } from '../../../../../../core/services/driver.service';
import { ToastService } from '../../../../../../shared/toast/service/toast.service';
import { ToastPosition, ToastType } from '../../../../../../shared/toast/model/toast.model';
import { DriverRequest } from '../../../../../../core/models/driver/http/request/driver-request.model';
import { DriverMapper } from '../../../../../../core/models/driver/http/mapper/driver-mapper.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-driver-list-update',
  templateUrl: './driver-list-update.component.html',
  styleUrls: ['./driver-list-update.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [DriverMapper],
})
export class DriverListUpdateComponent implements OnInit, OnDestroy {
  private _driver: Driver | null = null;
  private _isDialogOpen: boolean = false;
  private _dialogToggled = new EventEmitter<boolean>();
  private _updateDriverForm: FormGroup;
  private _driverUpdatedEvent = new EventEmitter<boolean>();
  private _errorMessage: string | null = null;
  private _isSubmitUpdateDriverButtonLoading: boolean = false;
  private _isCheckedAvailable = false;

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  constructor(
    private _fb: FormBuilder,
    private _driverService: DriverService,
    private _toastService: ToastService,
    private _driverMapper: DriverMapper,
  ) {
    this._updateDriverForm = this._fb.group({
      name: new FormControl(this.getDriver?.getName, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^\S/),
      ]),
      isAvailable: new FormControl(this.getDriver?.isAvailable, []),
    });
  }

  public get getFormBuilder(): FormBuilder {
    return this._fb;
  }

  public get getDriverService(): DriverService {
    return this._driverService;
  }

  public get getToastService(): ToastService {
    return this._toastService;
  }

  public get getDriverMapper(): DriverMapper {
    return this._driverMapper;
  }

  public get getDriver(): Driver | null {
    return this._driver;
  }

  @Input()
  public set setDriver(driver: Driver | null) {
    this._driver = driver;
    this._updateDriverForm.get('name')?.setValue(this.getDriver?.getName);
    this._updateDriverForm.get('isAvailable')?.setValue(this.getDriver?.isAvailable);
  }

  public get isDialogOpen(): boolean {
    return this._isDialogOpen;
  }

  @Output()
  public get getDialogToggled(): EventEmitter<boolean> {
    return this._dialogToggled;
  }

  @Output()
  public get getDriverUpdatedEvent(): EventEmitter<boolean> {
    return this._driverUpdatedEvent;
  }

  public get getUpdateDriverForm(): FormGroup {
    return this._updateDriverForm;
  }

  get errorMessage(): string | null {
    return this._errorMessage;
  }

  public set setErrorMessage(errorMessage: string | null) {
    this._errorMessage = errorMessage;
  }

  public get isSubmitUpdateDriverButtonLoading(): boolean {
    return this._isSubmitUpdateDriverButtonLoading;
  }

  public set setIsSubmitUpdateDriverButtonLoading(isSubmitUpdateDriverButtonLoading: boolean) {
    this._isSubmitUpdateDriverButtonLoading = isSubmitUpdateDriverButtonLoading;
  }

  public get isCheckedAvailable(): boolean {
    return this._isCheckedAvailable;
  }

  public set setCheckedAvailable(isCheckedAvailable: boolean) {
    this._isCheckedAvailable = isCheckedAvailable;
  }

  public toggleDialog(): void {
    this._isDialogOpen = !this._isDialogOpen;
    this.getDialogToggled.emit(this._isDialogOpen);
  }

  public onSubmitUpdateDriver(): void {
    if (this._updateDriverForm.invalid) {
      return;
    }

    const updatedDriver: Driver = new Driver(
      undefined,
      undefined,
      undefined,
      this._updateDriverForm.get('name')?.value,
      this.isCheckedAvailable,
    );

    const upadatedDriverRequest: DriverRequest = this._driverMapper.toDriverRequest(updatedDriver);

    this._driverService.updateDriver(this.getDriver?.getPublicId ?? '', upadatedDriverRequest).subscribe({
      next: (driverResponse) => {
        this._errorMessage = null;
        this.toggleDialog();
        this._toastService.show(
          'Mis à jour du livreur',
          'Le livreur a été mis à jour avec succès',
          5,
          ToastType.Success,
          ToastPosition.BottomRight,
        );
        this.getDriverUpdatedEvent.emit(true);
      },
      error: (error) => {
        console.log(error);
        if (error.status === 404) {
          this._errorMessage = 'Erreur : Ressource non trouvée (' + error?.status + ') - ' + error?.error?.message;
        } else {
          this._errorMessage =
            "Une erreur s'est produite lors de la mis à jour du livreur : (" +
            error?.status +
            ') - ' +
            error?.error?.message;
        }
        this._isSubmitUpdateDriverButtonLoading = false;
        this._toastService.show('Erreur', this._errorMessage, 5, ToastType.Error, ToastPosition.BottomRight);
        this.getDriverUpdatedEvent.emit(false);
      },
    });
  }
}
