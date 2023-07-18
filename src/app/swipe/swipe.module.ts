import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SwipePageRoutingModule } from './swipe-routing.module';

import { SwipePage } from './swipe.page';
import { SwiperModule } from 'swiper/angular';
import {LoginPageModule} from '../login/login.module'
import { LoginPage } from '../login/login.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SwipePageRoutingModule,
    SwiperModule,
    LoginPageModule
    
  ],
  declarations: [SwipePage],
})
export class SwipePageModule {}
