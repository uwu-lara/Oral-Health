import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'swipe',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'landing',
    loadChildren: () => import('./landing/landing.module').then( m => m.LandingPageModule)
  },

  {
    path: 'video',
    loadChildren: () => import('./video/video.module').then( m => m.HistoryPageModule)
  },
  {
    path: 'video-two',
    loadChildren: () => import('./video-two/video-two.module').then( m => m.VideoTwoPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'rekod',
    loadChildren: () => import('./rekod/rekod.module').then( m => m.RekodPageModule)
  },
  {
    path: 'swipe',
    loadChildren: () => import('./swipe/swipe.module').then( m => m.SwipePageModule)
  },
  {
    path: 'response',
    loadChildren: () => import('./response/response.module').then( m => m.ResponsePageModule)
  },
  {
    path: 'user-response',
    loadChildren: () => import('./user-response/user-response.module').then( m => m.userResponsePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
