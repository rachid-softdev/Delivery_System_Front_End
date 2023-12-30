import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoundResponse } from '../../../../../core/models/round/http/response/round-response.model';
import { RoundService } from '../../../../../core/services/round.service';
import { RoundPageResponse } from '../../../../../core/models/round/http/response/round-page-response.model';
import { ToastComponent } from '../../../../../shared/toast/component/toast.component';
import { RoundListCreateComponent } from './round-list-create/round-list-create.component';
import { RoundListDetailComponent } from './round-list-detail/round-list-detail.component';
import { RoundListUpdateComponent } from './round-list-update/round-list-update.component';
import { RoundListDeleteComponent } from './round-list-delete/round-list-delete.component';
import { CustomPaginatorComponent } from '../../../../../shared/components/custom-paginator/custom-paginator/custom-paginator.component';
import { SortDirection } from '../../../../../core/constants/sortdirection';

enum DialogType {
  AddRound,
  RoundUpdate,
  RoundDetail,
  RoundDelete,
}

@Component({
  selector: 'app-round-list',
  templateUrl: './round-list.component.html',
  styleUrls: ['./round-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RoundListCreateComponent,
    RoundListDetailComponent,
    RoundListUpdateComponent,
    RoundListDeleteComponent,
    CustomPaginatorComponent,
    ToastComponent,
  ],
  providers: [RoundService],
})
export class RoundListComponent implements OnInit, OnDestroy {
  public DialogType = DialogType;
  private _dialogState: Record<DialogType, boolean> = {
    [DialogType.AddRound]: false,
    [DialogType.RoundUpdate]: false,
    [DialogType.RoundDetail]: false,
    [DialogType.RoundDelete]: false,
  };

  private _roundPageResponse: RoundPageResponse = new RoundPageResponse();

  private rounds: RoundResponse[] = [
    new RoundResponse('id-1', '2023-09-20T10:00:00Z', '2023-09-20T14:30:00Z', 'Tournée de Brigitte'),
    new RoundResponse('id-2', '2023-09-19T09:15:00Z', '2023-09-19T16:45:00Z', 'Tournée de Toulouse'),
    new RoundResponse('id-3', '2023-09-19T08:00:00Z', '2023-09-19T18:00:00Z', 'Tournée de Paris'),
  ];

  private _selectedRound: RoundResponse | null = null;

  private _newRound: RoundResponse = new RoundResponse();

  private _currentPage: number = 0;

  // Search
  private _isCheckedAvailable = false;
  private _searchDate: Date | null = null;
  // Searchs
  public get isCheckedAvailable(): boolean {
    return this._isCheckedAvailable;
  }

  public set setCheckedAvailable(isCheckedAvailable: boolean) {
    this._isCheckedAvailable = isCheckedAvailable;
  }

  public get getSearchDate(): Date | null {
    return this._searchDate;
  }

  public set setSearchDate(searchDate: Date | null) {
    this._searchDate = searchDate;
  }

  public onSearchDateChanged(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    if (value) {
      const date = new Date(value);
      this._searchDate = date;
    } else {
      this._searchDate = null;
    }
  }

  public onSubmitSearchRounds(): void {
    const page: number = this.getCurrentPage;
    const size: number = this.getRoundPageResponse?.size ?? 10; 
    const sortBy: string = 'createdAt';
    const sortOrder: string = 'asc';
    this.roundService.getAllRoundsPaginated(this.getSearchDate, page, size, sortBy, sortOrder).subscribe((response: RoundPageResponse) => {
      this.setRoundPageResponse = response;
      this.setRounds =
        this._roundPageResponse?.content?.map((apiData: any) => RoundResponse.mapToRoundResponse(apiData)) || [];
      this.setCurrentPage = page;
    });
  }

  ngOnInit(): void {
    this.loadRounds();
  }

  ngOnDestroy(): void {
    this.rounds = [];
  }

  constructor(private roundService: RoundService) {}

  public get getDialogState(): Record<DialogType, boolean> {
    return this._dialogState;
  }

  public set setDialogState(dialogState: Record<DialogType, boolean>) {
    this._dialogState = dialogState;
  }

  public get getRoundPageResponse(): RoundPageResponse {
    return this._roundPageResponse;
  }

  public set setRoundPageResponse(value: RoundPageResponse) {
    this._roundPageResponse = value;
  }

  public get getRounds(): RoundResponse[] {
    return this.rounds;
  }

  public set setRounds(rounds: RoundResponse[]) {
    this.rounds = rounds;
  }

  public get getNewRound(): RoundResponse {
    return this._newRound;
  }

  public set setNewRound(newRound: RoundResponse) {
    this._newRound = newRound;
  }

  public get getSelectedRound(): RoundResponse | null {
    return this._selectedRound;
  }

  public set setSelectedRound(round: RoundResponse | null) {
    this._selectedRound = round;
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
        this.loadRounds();
        return;
      }
      this.searchByName = value;
      this.setRounds = this.rounds.filter((round) =>
        round.getName.toLowerCase().includes(this.searchByName.toLowerCase()),
      );
    }
  }

  public loadRounds(): void {
    const page: number = this.getCurrentPage;
    const size: number = this.getRoundPageResponse?.size ?? 10;
    const sortBy: string = 'createdAt';
    const sortOrder: string = 'asc';
    this.roundService.getAllRoundsPaginated(null, page, size, sortBy, sortOrder).subscribe((response: RoundPageResponse) => {
      this.setRoundPageResponse = response;
      this.setRounds =
        this._roundPageResponse?.content?.map((apiData: any) => RoundResponse.mapToRoundResponse(apiData)) || [];
      this.setCurrentPage = page;
    });
  }

  public toggleDialog(dialogType: DialogType): void {
    this._dialogState[dialogType] = !this._dialogState[dialogType];
  }

  public pageChanged(event: number): void {
    this.setCurrentPage = event - 1;
    this.loadRounds();
  }

  public onRoundCreated(): void {
    this.loadRounds();
  }

  public onRoundUpdateClick(round: RoundResponse): void {
    this.setSelectedRound = round;
    this.toggleDialog(DialogType.RoundUpdate);
  }

  public onRoundUpdated(): void {
    this.loadRounds();
  }

  public onRoundDetailClick(round: RoundResponse): void {
    this.setSelectedRound = round;
    this.toggleDialog(DialogType.RoundDetail);
  }

  public onRoundDeleteClick(round: RoundResponse): void {
    this.setSelectedRound = round;
    this.toggleDialog(DialogType.RoundDelete);
  }

  public onRoundDeleted(): void {
    this.loadRounds();
  }
}
