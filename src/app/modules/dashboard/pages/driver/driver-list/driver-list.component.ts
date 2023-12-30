import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Driver } from '../../../../../core/models/driver/driver.model';
import { DriverService } from '../../../../../core/services/driver.service';
import { DriverPageResponse } from '../../../../../core/models/driver/http/response/driver-page-response.model';
import { ToastComponent } from '../../../../../shared/toast/component/toast.component';
import { DriverListCreateComponent } from './driver-list-create/driver-list-create.component';
import { DriverListDetailComponent } from './driver-list-detail/driver-list-detail.component';
import { DriverListUpdateComponent } from './driver-list-update/driver-list-update.component';
import { DriverListDeleteComponent } from './driver-list-delete/driver-list-delete.component';
import { CustomPaginatorComponent } from '../../../../../shared/components/custom-paginator/custom-paginator/custom-paginator.component';
import { DriverListHeaderComponent } from '../../../components/driver/driver-list/driver-list-header/driver-list-header.component';
import { SortDirection } from '../../../../../core/constants/sortdirection';

enum DialogType {
  AddDriver,
  DriverUpdate,
  DriverDetail,
  DriverDelete,
}

@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    DriverListCreateComponent,
    DriverListDetailComponent,
    DriverListUpdateComponent,
    DriverListDeleteComponent,
    DriverListHeaderComponent,
    CustomPaginatorComponent,
    ToastComponent,
  ],
  providers: [DriverService],
})
export class DriverListComponent implements OnInit, OnDestroy {
  public DialogType = DialogType;
  private _dialogState: Record<DialogType, boolean> = {
    [DialogType.AddDriver]: false,
    [DialogType.DriverUpdate]: false,
    [DialogType.DriverDetail]: false,
    [DialogType.DriverDelete]: false,
  };

  private _driverPageResponse: DriverPageResponse = new DriverPageResponse();

  private drivers: Driver[] = [
    new Driver('id-1', '2023-09-20T10:00:00Z', '2023-09-20T14:30:00Z', 'John Doe', true),
    new Driver('id-2', '2023-09-19T09:15:00Z', '2023-09-19T16:45:00Z', 'Jane Smith', false),
    new Driver('id-3', '2023-09-19T08:00:00Z', '2023-09-19T18:00:00Z', 'Alfred Cook', false),
  ];

  private _selectedDriver: Driver | null = null;

  private _newDriver: Driver = new Driver();

  private _currentPage: number = 0;

  // Sorts
  private _defaultSortField: string = 'createdAt';
  private _defaultSortDirection: SortDirection = SortDirection.Ascending;
  private _currentSortField: string = this._defaultSortField;
  private _currentSortDirection: SortDirection = this._defaultSortDirection;
  private _sortDirection = SortDirection;
  private _sortFields: { [key: string]: { publicField: string; privateField: string } } = {
    publicId: { publicField: 'public', privateField: 'publicId' },
    name: { publicField: 'nom', privateField: 'name' },
    isAvailable: { publicField: 'disponible', privateField: 'isAvailable' },
    createdAt: { publicField: 'cree_le', privateField: 'createdAt' },
    updatedAt: { publicField: 'misajour_le', privateField: 'updatedAt' },
    rounds: { publicField: 'tournees', privateField: 'rounds' },
  };

  // Search
  private _isCheckedAvailable = false;
  private _createdAtAfter: Date | null = null;
  private _createdAtBefore: Date | null = null;

  public get getDefaultSortField(): string {
    return this._defaultSortField;
  }

  public get getDefaultSortDirection(): SortDirection {
    return this._defaultSortDirection;
  }

  public get getSortFields(): { [key: string]: { publicField: string; privateField: string } } {
    return this._sortFields;
  }

  public set setSortFields(sortFields: { [key: string]: { publicField: string; privateField: string } }) {
    this._sortFields = sortFields;
  }

  public get getSortDirection(): typeof SortDirection {
    return this._sortDirection;
  }

  public get getCurrentSortField(): string {
    return this._currentSortField;
  }

  public get getCurrentSortDirection(): SortDirection {
    return this._currentSortDirection;
  }

  private set setCurrentSortField(fieldName: string) {
    this._currentSortField = fieldName;
  }

  private set setCurrentSortDirection(sortDirection: SortDirection) {
    this._currentSortDirection = sortDirection;
  }

  public toggleSortDirection(publicFieldName: string = ''): void {
    let fieldName = null;
    for (const key in this.getSortFields) {
      if (this.getSortFields[key].publicField === publicFieldName) {
        fieldName = key;
        break;
      }
    }
    if (!fieldName) return;
    if (this.getCurrentSortField === fieldName) {
      this.setCurrentSortDirection =
        this.getCurrentSortDirection === SortDirection.Ascending ? SortDirection.Descending : SortDirection.Ascending;
    } else {
      this.setCurrentSortDirection = SortDirection.Ascending;
    }
    const privateFieldName = this.getSortFields[fieldName]?.privateField ?? this.getDefaultSortField;
    this.setCurrentSortField = privateFieldName;
    this.loadDrivers();
  }

  // Searchs
  public get isCheckedAvailable(): boolean {
    return this._isCheckedAvailable;
  }

  public set setCheckedAvailable(isCheckedAvailable: boolean) {
    this._isCheckedAvailable = isCheckedAvailable;
  }

  public get getCreatedAtAfter(): Date | null {
    return this._createdAtAfter;
  }

  public set setCreatedAtAfter(createdAtAfter: Date | null) {
    this._createdAtAfter = createdAtAfter;
  }

  public get getCreatedAtBefore(): Date | null {
    return this._createdAtBefore;
  }

  public set setCreatedAtBefore(createdAtBefore: Date | null) {
    this._createdAtBefore = createdAtBefore;
  }

  public onCreatedAtAfterChanged(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    if (value) {
      const date = new Date(value);
      this.setCreatedAtAfter = date;
    }
  }

  public onCreatedAtBeforeChanged(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    if (value) {
      const date = new Date(value);
      this.setCreatedAtBefore = date;
    }
  }

  public onSubmitSearchDrivers(): void {
    const page: number = this.getCurrentPage;
    const size: number = this.getDriverPageResponse?.size ?? 10;
    const sortBy: string = this.getCurrentSortField ?? this.getDefaultSortField;
    const sortOrder: string = this.getCurrentSortDirection ?? this.getDefaultSortDirection;
    this.driverService
      .searchDrivers(
        this.getCreatedAtAfter,
        this.getCreatedAtBefore,
        this.isCheckedAvailable,
        page,
        size,
        sortBy,
        sortOrder,
      )
      .subscribe((response: DriverPageResponse) => {
        this.setDriverPageResponse = response;
        this.setDrivers = this._driverPageResponse?.content?.map((apiData: any) => Driver.mapToDriver(apiData)) || [];
        this.setCurrentPage = page;
      });
  }

  ngOnInit(): void {
    this.loadDrivers();
  }

  ngOnDestroy(): void {
    this.drivers = [];
  }

  constructor(private driverService: DriverService) {}

  public get getDialogState(): Record<DialogType, boolean> {
    return this._dialogState;
  }

  public set setDialogState(dialogState: Record<DialogType, boolean>) {
    this._dialogState = dialogState;
  }

  public get getDriverPageResponse(): DriverPageResponse {
    return this._driverPageResponse;
  }

  public set setDriverPageResponse(value: DriverPageResponse) {
    this._driverPageResponse = value;
  }

  public get getDrivers(): Driver[] {
    return this.drivers;
  }

  public set setDrivers(drivers: Driver[]) {
    this.drivers = drivers;
  }

  public get getNewDriver(): Driver {
    return this._newDriver;
  }

  public set setNewDriver(newDriver: Driver) {
    this._newDriver = newDriver;
  }

  public get getSelectedDriver(): Driver | null {
    return this._selectedDriver;
  }

  public set setSelectedDriver(driver: Driver | null) {
    this._selectedDriver = driver;
  }

  public get getCurrentPage(): number {
    return this._currentPage;
  }

  public set setCurrentPage(currentPage: number) {
    this._currentPage = currentPage;
  }

  searchByName: string = '';
  onSearch(event: Event): void {
    if (event.target as HTMLInputElement) {
      const value = (event.target as HTMLInputElement).value;
      if (!value || value.length === 0) {
        this.loadDrivers();
        return;
      }
      this.searchByName = value;
      this.setDrivers = this.drivers.filter((driver) =>
        driver.getName.toLowerCase().includes(this.searchByName.toLowerCase()),
      );
    }
  }

  public loadDrivers(): void {
    const page: number = this.getCurrentPage;
    const size: number = this.getDriverPageResponse?.size ?? 10;
    const sortBy: string = this.getCurrentSortField ?? this.getDefaultSortField;
    const sortOrder: string = this.getCurrentSortDirection ?? this.getDefaultSortDirection;
    this.driverService
      .getAllDriversPaginated(page, size, sortBy, sortOrder)
      .subscribe((response: DriverPageResponse) => {
        this.setDriverPageResponse = response;
        this.setDrivers = this._driverPageResponse?.content?.map((apiData: any) => Driver.mapToDriver(apiData)) || [];
        this.setCurrentPage = page;
      });
  }

  public toggleDialog(dialogType: DialogType): void {
    this._dialogState[dialogType] = !this._dialogState[dialogType];
  }

  public pageChanged(event: number): void {
    this.setCurrentPage = event - 1;
    this.loadDrivers();
  }

  public onDriverCreated(): void {
    this.loadDrivers();
  }

  public onDriverUpdateClick(driver: Driver): void {
    this.setSelectedDriver = driver;
    this.toggleDialog(DialogType.DriverUpdate);
  }

  public onDriverUpdated(): void {
    this.loadDrivers();
  }

  public onDriverDetailClick(driver: Driver): void {
    this.setSelectedDriver = driver;
    this.toggleDialog(DialogType.DriverDetail);
  }

  public onDriverDeleteClick(driver: Driver): void {
    this.setSelectedDriver = driver;
    this.toggleDialog(DialogType.DriverDelete);
  }

  public onDriverDeleted(): void {
    this.loadDrivers();
  }
}
