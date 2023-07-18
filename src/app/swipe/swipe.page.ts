import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { SwiperComponent } from 'swiper/angular';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-swipe',
  templateUrl: './swipe.page.html',
  styleUrls: ['./swipe.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SwipePage implements OnInit {

  slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  loading: HTMLIonLoadingElement;
  user: unknown;
  timetable: any;
  constructor(public router: Router, private data: DataService,
    public loadingController: LoadingController,
    public toastController: ToastController,) { }

  async ngOnInit() {

    this.data.getUser()
    this.data.getTimeTable()
    this.loading = await this.loadingController.create({
      message: 'Please Wait Login in progress',
    });
    this.user = this.data.user
    this.timetable = this.data.timeTable
    if (this.user && this.timetable) {
      // console.log(this.user);

      await this.loading.present();
      this.router.navigate(['landing'])
      this.loading.dismiss()
    }
  }

//   onSwipeRight(e) {
//     // console.log(e);
    
//     if (e.direction == 2) {
//       this.router.navigate(['home'])
//     }
// }

}
