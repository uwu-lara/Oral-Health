import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { SyncService } from '../services/sync.service';

@Component({
  selector: 'app-user-response',
  templateUrl: './user-response.page.html',
  styleUrls: ['./user-response.page.scss'],
})
export class userResponsePage implements OnInit {

  timeSlot: string;

  constructor(public router:Router, public toastController: ToastController, public route:ActivatedRoute, public sync:SyncService) { }

  ngOnInit() {
    this.timeSlot = this.route.snapshot.paramMap.get('timeSlot')
  }

  goBack(){
    this.router.navigate(['landing'])
  }
  async showToast(){
    let timetable_toast = await this.toastController.create({
      message: '✅ Thank you for the Response',
      duration: 3000,
    });
    timetable_toast.present();
    this.goBack()
  }

  async Sudha(){
    this.sync.updateDailyTransaction(this.timeSlot,'1' )
    this.showToast()
  }
  async Belum(){
    this.sync.updateDailyTransaction(this.timeSlot,'2' )
    this.showToast()
  }

}
