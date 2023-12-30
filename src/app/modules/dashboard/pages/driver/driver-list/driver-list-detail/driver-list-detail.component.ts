import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Driver } from '../../../../../../core/models/driver/driver.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-driver-list-detail',
  templateUrl: './driver-list-detail.component.html',
  styleUrls: ['./driver-list-detail.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class DriverListDetailComponent {
  private _driver: Driver | null = null;
  private _isDialogOpen: boolean = false;
  private _dialogToggled = new EventEmitter<boolean>();

  public get getDriver(): Driver | null {
    return this._driver;
  }

  @Input()
  public set setDriver(driver: Driver | null) {
    this._driver = driver;
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
