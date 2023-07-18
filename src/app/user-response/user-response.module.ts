import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { userResponseRoutingModule } from './user-response-routing.module';

import { userResponsePage } from './user-response.page';
import { SharedModule } from '../modules/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    IonicModule,
    userResponseRoutingModule
  ],
  declarations: [userResponsePage]
})
export class userResponsePageModule {}
