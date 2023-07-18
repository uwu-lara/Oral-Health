import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { VideoPlayer } from '@awesome-cordova-plugins/video-player/ngx';

import {VideoPageRoutingModule } from './video-routing.module';

import { VideoPage } from './video.page';
import { SharedModule } from '../modules/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    IonicModule,
    VideoPageRoutingModule,
  ],
  declarations: [VideoPage],
  providers:[VideoPlayer]
})
export class HistoryPageModule {}
