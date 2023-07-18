import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { userResponsePage } from './user-response.page';

const routes: Routes = [
  {
    path: '',
    component: userResponsePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class userResponseRoutingModule {}
