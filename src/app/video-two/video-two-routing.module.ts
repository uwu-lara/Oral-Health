import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VideoTwoPage } from './video-two.page';

const routes: Routes = [
  {
    path: '',
    component: VideoTwoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideoPageRoutingModule {}
