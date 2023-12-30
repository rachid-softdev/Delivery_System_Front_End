import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DriverListComponent } from './pages/driver/driver-list/driver-list.component';
import { RoundListComponent } from './pages/round/round-list/round-list.component';
import { DeliveryListComponent } from './pages/delivery/delivery-list/delivery-list.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'drivers', pathMatch: 'full' },
      { path: 'drivers', component: DriverListComponent },
      { path: 'rounds', component: RoundListComponent },
      { path: 'deliveries', component: DeliveryListComponent },
      { path: '**', redirectTo: 'drivers' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
