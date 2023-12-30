import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Driver } from '../../../../../../core/models/driver/driver.model';
import { DriverService } from '../../../../../../core/services/driver.service';
import { ToastService } from '../../../../../../shared/toast/service/toast.service';
import { ToastPosition, ToastType } from '../../../../../../shared/toast/model/toast.model';
import { DriverRequest } from '../../../../../../core/models/driver/http/request/driver-request.model';
import { DriverMapper } from '../../../../../../core/models/driver/http/mapper/driver-mapper.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-driver-list-create',
  templateUrl: './driver-list-create.component.html',
  styleUrls: ['./driver-list-create.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [DriverMapper],
})
export class DriverListCreateComponent implements OnInit, OnDestroy {
  private _isDialogOpen: boolean = false;
  private _dialogToggled = new EventEmitter<boolean>();
  // https://www.tektutorialshub.com/angular/angular-reactive-forms-validation/
  private _createDriverForm: FormGroup;
  private _driverCreatedEvent = new EventEmitter<boolean>();
  private _errorMessage: string | null = null;
  private _isSubmitCreateDriverButtonLoading: boolean = false;
  private _isCheckedAvailable = false;

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  constructor(
    private _fb: FormBuilder,
    private _driverService: DriverService,
    private _toastService: ToastService,
    private _driverMapper: DriverMapper,
  ) {
    this._createDriverForm = this._fb.group({
      name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(/^\S/)]),
      isAvailable: new FormControl(false, []),
    });
  }

  public handleCheckedChange(isChecked: boolean) {
    this._createDriverForm.get('isAvailable')?.setValue(isChecked);
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

  public get isDialogOpen(): boolean {
    return this._isDialogOpen;
  }

  @Output()
  public get getDialogToggled(): EventEmitter<boolean> {
    return this._dialogToggled;
  }

  @Output()
  public get getDriverCreatedEvent(): EventEmitter<boolean> {
    return this._driverCreatedEvent;
  }

  public get getCreateDriverForm(): FormGroup {
    return this._createDriverForm;
  }

  get errorMessage(): string | null {
    return this._errorMessage;
  }

  public set setErrorMessage(errorMessage: string | null) {
    this._errorMessage = errorMessage;
  }

  public get isSubmitCreateDriverButtonLoading(): boolean {
    return this._isSubmitCreateDriverButtonLoading;
  }

  public set setIsSubmitCreateDriverButtonLoading(isSubmitCreateDriverButtonLoading: boolean) {
    this._isSubmitCreateDriverButtonLoading = isSubmitCreateDriverButtonLoading;
  }

  public get isCheckedAvailable(): boolean {
    return this._isCheckedAvailable;
  }

  public set setCheckedAvailable(isCheckedAvailable: boolean) {
    this._isCheckedAvailable = isCheckedAvailable;
  }

  public toggleDialog(): void {
    this.resetForm();
    this._isDialogOpen = !this._isDialogOpen;
    this._dialogToggled.emit(this._isDialogOpen);
  }

  public resetForm(): void {
    this._errorMessage = null;
    this._createDriverForm.reset();
  }

  public onSubmitCreateDriver(): void {
    this._isSubmitCreateDriverButtonLoading = true;
    if (this._createDriverForm.invalid) {
      this._isSubmitCreateDriverButtonLoading = false;
      return;
    }

    const createdAt: string = new Date().toISOString().toString(),
      updatedAt = createdAt;

    const newDriver: Driver = new Driver(
      undefined,
      createdAt,
      updatedAt,
      this._createDriverForm.get('name')?.value,
      this.isCheckedAvailable,
    );

    const newDriverRequest: DriverRequest = this._driverMapper.toDriverRequest(newDriver);

    this._driverService.createDriver(newDriverRequest).subscribe({
      next: (driverResponse) => {
        this._createDriverForm.reset();
        this._errorMessage = null;
        this._isSubmitCreateDriverButtonLoading = false;
        this.toggleDialog();
        this._toastService.show(
          'Nouveau livreur',
          'Le livreur a été crée avec succès',
          5,
          ToastType.Success,
          ToastPosition.BottomRight,
        );
        this.getDriverCreatedEvent.emit(true);
      },
      error: (error) => {
        console.log(error);
        if (error.status === 404) {
          this._errorMessage = 'Erreur : Ressource non trouvée (' + error?.status + ') - ' + error?.error?.message;
        } else {
          this._errorMessage =
            "Une erreur s'est produite lors de la création du livreur : (" +
            error?.status +
            ') - ' +
            error?.error?.message;
        }
        this._isSubmitCreateDriverButtonLoading = false;
        this._toastService.show('Erreur', this._errorMessage, 5, ToastType.Error, ToastPosition.BottomRight);
        this.getDriverCreatedEvent.emit(false);
      },
    });
  }
}
