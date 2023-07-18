import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
// import WonderPush from 'wonderpush-cordova-sdk';







@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public idNumber;
  public greeting;
  Refid: any;
  loading: HTMLIonLoadingElement;
  user: any;
  timetable: any;
  constructor(private auth: AuthService, public router: Router, private data: DataService,
    public loadingController: LoadingController,
    public toastController: ToastController,) {
    let currentTime = new Date()
    let ampm = currentTime.getHours() < 12 ? 'am' : 'pm';
    if (ampm == 'am') {
      this.greeting = "Good Morning"
    } else if (ampm == 'pm') {
      this.greeting = "Good Evening"
    }
    // console.log(ampm);

  }

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

  async login() {
    if (this.idNumber == 'test') {
      this.router.navigate(['landing'])
      this.auth.login(this.idNumber)
        .then(async (res: any) => {

          // console.log('login res', res);
          if (res.MyBiodata[0]) {
            // this.Refid = res.MyBiodata[0].Refid
            // this.data.setItem('-user-', res.MyBiodata[0])
            // console.log(this.Refid);
            // WonderPush.setUserId(this.Refid)
            this.router.navigate(['landing'])
          }
        })
    } else {
      try {
        await this.loading.present();

        this.auth.login(this.idNumber)
          .then(async (res: any) => {

            // console.log('login res', res);
            if (res.MyBiodata) {
              this.Refid = res.MyBiodata[0].Refid
              this.data.setItem('-user-', res.MyBiodata[0])
              console.log(this.Refid);
              if (this.Refid) {
                try {
                  this.auth.loadMedicineTimetable(this.Refid)
                    .then(async (res: any) => {
                      if (res.MyTimetable) {
                        this.data.setItem('-timeTable-', res.MyTimetable)
                        this.data.timeTable = res.MyTimetable
                        this.loading.dismiss()
                        this.router.navigate(['landing'])
                      } else {
                        this.loading.dismiss()
                        this.data.removeAll()
                        let timetable_toast = await this.toastController.create({
                          message: 'Loading timetable Faild. Please try again',
                          duration: 3000,
                        });
                        timetable_toast.present();

                      }
                    })
                } catch (error) {
                  this.loading.dismiss()
                  this.data.removeAll()
                  let timetable_toast_e = await this.toastController.create({
                    message: 'Loading timetable Faild. Please try again',
                    duration: 3000,
                  });
                  timetable_toast_e.present();

                }
              } else {
                this.data.removeAll()
                this.loading.dismiss()
                const toast = await this.toastController.create({
                  message: 'Login unsuccess. Please try again',
                  duration: 3000,
                });
                toast.present();
              }

            } else {
              this.data.removeAll()
              this.loading.dismiss()
              const toast = await this.toastController.create({
                message: 'Login unsuccess. Please try again',
                duration: 3000,
              });
              toast.present();
            }

          })
        // console.log(this.idNumber);

      } catch (error) {
        this.loading.dismiss()
        let _connectivity = await this.toastController.create({
          message: 'Login unsuccess. Please check the connectivity',
          duration: 3000,
        });
        _connectivity.present();
      }
    }

  }
  register() {
    this.router.navigate(['register'])

  }

}
// 0192142100
