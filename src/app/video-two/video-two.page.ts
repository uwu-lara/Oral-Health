import { Component, OnInit, ViewChild } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { IonModal, LoadingController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { SyncService } from '../services/sync.service';
import { VideoPlayer } from '@awesome-cordova-plugins/video-player/ngx';

import { OverlayEventDetail } from '@ionic/core/components';
import { Platform } from '@ionic/angular';
import { LocalStorage } from "@ngx-pwa/local-storage";


@Component({
  selector: 'app-video-two',
  templateUrl: './video-two.page.html',
  styleUrls: ['./video-two.page.scss'],
})
export class VideoTwoPage implements OnInit {
  public _user: any;
  url: any;
  showButton: boolean;
  isModalOpen: boolean;
  slot: string;
  date: string;
  showVideo: boolean;
  @ViewChild(IonModal) modal: IonModal;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name: string;
  width: () => number;
  link2: any;
  link1: any;
  constructor(public localStorage: LocalStorage, platform: Platform,private videoPlayer: VideoPlayer,public sync:SyncService,public loadingController: LoadingController, public data: DataService, public router:Router) {
    let date = new Date(); // create a new Date object for the current date and time
    const hour = date.getHours(); // get the current hour
    
    if (hour < 12) {
      this.slot = "M"
    } else if (hour < 18) {
      this.slot = "A"
    } else {
      this.slot = "E"
        }
      this.date = date.toISOString().substring(0, 10);
  
      platform.ready().then(() => {
      console.log('Width: ' + platform.width());
      console.log('Height: ' + platform.height());
      this.width = platform.width
    });
    this.getLink()

  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      // this.message = `Hello, ${ev.detail.data}!`;
      console.log(ev.detail.role);
      
      this.goBack()
      
    }
  }
  
  ngOnInit() {
    this.getLink()

    this.showVideo = true
  }

  play(){
    this.videoPlayer.play('https://inet-tmsolutions.com/medhelpmovie/med_2.mp4').then(() => {
 console.log('video completed');
}).catch(err => {
 console.log(err);
});
  }
  goBack(){
    this.showVideo = false
    this.isModalOpen = false
    
    if (!this.isModalOpen) {
      
      this.router.navigate(['landing'])
    }

  }

  ionViewDidEnter() {
    this.showButton = false
    this.isModalOpen = true
if (this.isModalOpen) {
  setTimeout(() => {
    this.showButton = true
  }, 1000*5);
}
  }

  setOpen(){
    this.isModalOpen = false;
  }

  startVideo(){
    this.isModalOpen = true
  }

  closeVideo(){
    this.showVideo = false
    this.goBack()
  }

  async getLink(){
    await this.localStorage.getItem('-link2-').subscribe((val) => {
      console.log(val);
      this.link2 = val
    });
  }

}
