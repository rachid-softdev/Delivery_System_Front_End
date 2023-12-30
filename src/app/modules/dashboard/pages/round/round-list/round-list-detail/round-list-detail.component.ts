import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RoundResponse } from '../../../../../../core/models/round/http/response/round-response.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-round-list-detail',
  templateUrl: './round-list-detail.component.html',
  styleUrls: ['./round-list-detail.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class RoundListDetailComponent {
  private _round: RoundResponse | null = null;
  private _isDialogOpen: boolean = false;
  private _dialogToggled = new EventEmitter<boolean>();

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

  public toggleDialog(): void {
    this._isDialogOpen = !this._isDialogOpen;
    this._dialogToggled.emit(this._isDialogOpen);
  }
}
