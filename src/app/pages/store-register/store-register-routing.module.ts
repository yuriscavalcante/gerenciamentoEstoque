import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoreRegisterPage } from './store-register.page';

const routes: Routes = [
  {
    path: '',
    component: StoreRegisterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoreRegisterPageRoutingModule {}
