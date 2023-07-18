import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RekodPageRoutingModule } from './rekod-routing.module';

import { RekodPage } from './rekod.page';
import { SharedModule } from '../modules/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RekodPageRoutingModule
  ],
  declarations: [RekodPage]
})
export class RekodPageModule {}
