import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoreRegisterPageRoutingModule } from './store-register-routing.module';

import { StoreRegisterPage } from './store-register.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoreRegisterPageRoutingModule
  ],
  declarations: [StoreRegisterPage]
})
export class StoreRegisterPageModule {}
