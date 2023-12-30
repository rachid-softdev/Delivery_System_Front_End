import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryResponse } from '../../../../../core/models/delivery/http/response/delivery-response.model';
import { DeliveryService } from '../../../../../core/services/delivery.service';
import { DeliveryPageResponse } from '../../../../../core/models/delivery/http/response/delivery-page-response.model';
import { ToastComponent } from '../../../../../shared/toast/component/toast.component';
import { DeliveryListCreateComponent } from './delivery-list-create/delivery-list-create.component';
import { DeliveryListDetailComponent } from './delivery-list-detail/delivery-list-detail.component';
import { DeliveryListUpdateComponent } from './delivery-list-update/delivery-list-update.component';
import { DeliveryListDeleteComponent } from './delivery-list-delete/delivery-list-delete.component';
import { CustomPaginatorComponent } from '../../../../../shared/components/custom-paginator/custom-paginator/custom-paginator.component';
import { RoundService } from '../../../../../core/services/round.service';

enum DialogType {
  AddDelivery,
  DeliveryUpdate,
  DeliveryDetail,
  DeliveryDelete,
}

@Component({
  selector: 'app-delivery-list',
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    DeliveryListCreateComponent,
    DeliveryListDetailComponent,
    DeliveryListUpdateComponent,
    DeliveryListDeleteComponent,
    CustomPaginatorComponent,
    ToastComponent,
  ],
  providers: [DeliveryService, RoundService],
})
export class DeliveryListComponent implements OnInit, OnDestroy {
  public DialogType = DialogType;
  private _dialogState: Record<DialogType, boolean> = {
    [DialogType.AddDelivery]: false,
    [DialogType.DeliveryUpdate]: false,
    [DialogType.DeliveryDetail]: false,
    [DialogType.DeliveryDelete]: false,
  };

  private _deliveryPageResponse: DeliveryPageResponse = new DeliveryPageResponse();

  private deliveries: DeliveryResponse[] = [
    new DeliveryResponse('id-1', '2023-09-20T10:00:00Z', '2023-09-20T14:30:00Z', 'Tournée de Brigitte'),
    new DeliveryResponse('id-2', '2023-09-19T09:15:00Z', '2023-09-19T16:45:00Z', 'Tournée de Toulouse'),
    new DeliveryResponse('id-3', '2023-09-19T08:00:00Z', '2023-09-19T18:00:00Z', 'Tournée de Paris'),
  ];

  private _selectedDelivery: DeliveryResponse | null = null;

  private _newDelivery: DeliveryResponse = new DeliveryResponse();

  private _currentPage: number = 0;

  ngOnInit(): void {
    this.loadDeliveries();
  }

  ngOnDestroy(): void {
    this.deliveries = [];
  }

  constructor(private deliveryService: DeliveryService) {}

  public get getDialogState(): Record<DialogType, boolean> {
    return this._dialogState;
  }

  public set setDialogState(dialogState: Record<DialogType, boolean>) {
    this._dialogState = dialogState;
  }

  public get getDeliveryPageResponse(): DeliveryPageResponse {
    return this._deliveryPageResponse;
  }

  public set setDeliveryPageResponse(value: DeliveryPageResponse) {
    this._deliveryPageResponse = value;
  }

  public get getDeliveries(): DeliveryResponse[] {
    return this.deliveries;
  }

  public set setDeliveries(deliveries: DeliveryResponse[]) {
    this.deliveries = deliveries;
  }

  public get getNewDelivery(): DeliveryResponse {
    return this._newDelivery;
  }

  public set setNewDelivery(newDelivery: DeliveryResponse) {
    this._newDelivery = newDelivery;
  }

  public get getSelectedDelivery(): DeliveryResponse | null {
    return this._selectedDelivery;
  }

  public set setSelectedDelivery(delivery: DeliveryResponse | null) {
    this._selectedDelivery = delivery;
  }

  public get getCurrentPage(): number {
    return this._currentPage;
  }

  public set setCurrentPage(currentPage: number) {
    this._currentPage = currentPage;
  }

  searchByAddress: string = '';
  onSearch(event: Event): void {
    if (event.target as HTMLInputElement) {
      const value = (event.target as HTMLInputElement).value;
      if (!value || value.length === 0) {
        this.loadDeliveries();
        return;
      }
      this.searchByAddress = value;
      this.setDeliveries = this.deliveries.filter((delivery) => {
        return (
          delivery.getPickupAddress.toLowerCase().includes(this.searchByAddress.toLowerCase()) ||
          delivery.getDropoffAddress.toLowerCase().includes(this.searchByAddress.toLowerCase())
        );
      });
    }
  }

  public loadDeliveries(): void {
    const page: number = this.getCurrentPage;
    const size: number = this.getDeliveryPageResponse?.size ?? 10;
    const sortBy: string = 'createdAt';
    const sortOrder: string = 'asc';
    this.deliveryService
      .getAllDeliveriesPaginated(page, size, sortBy, sortOrder)
      .subscribe((response: DeliveryPageResponse) => {
        this.setDeliveryPageResponse = response;
        this.setDeliveries = [];

        this.setDeliveries =
          this._deliveryPageResponse?.content?.map((apiData: any) => DeliveryResponse.mapToDeliveryResponse(apiData)) ||
          [];
        this.setCurrentPage = page;
      });
  }

  public toggleDialog(dialogType: DialogType): void {
    this._dialogState[dialogType] = !this._dialogState[dialogType];
  }

  public pageChanged(event: number): void {
    this.setCurrentPage = event - 1;
    this.loadDeliveries();
  }

  public onDeliveryCreated(): void {
    this.loadDeliveries();
  }

  public onDeliveryUpdateClick(delivery: DeliveryResponse): void {
    this.setSelectedDelivery = delivery;
    this.toggleDialog(DialogType.DeliveryUpdate);
  }

  public onDeliveryUpdated(): void {
    this.loadDeliveries();
  }

  public onDeliveryDetailClick(delivery: DeliveryResponse): void {
    this.setSelectedDelivery = delivery;
    this.toggleDialog(DialogType.DeliveryDetail);
  }

  public onDeliveryDeleteClick(delivery: DeliveryResponse): void {
    this.setSelectedDelivery = delivery;
    this.toggleDialog(DialogType.DeliveryDelete);
  }

  public onDeliveryDeleted(): void {
    console.log('reload');
    this.loadDeliveries();
  }
}
