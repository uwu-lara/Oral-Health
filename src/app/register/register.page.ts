import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  firstTime: any;
  num = 0;
  url: string;

  constructor(public loadingController: LoadingController, public router:Router) {
    this.showLoading()
    // this.url = "https://inet-tmsolutions.com/BHApps/register"
    this.url = "https://inet-tmsolutions.com/BHApps/oralregister"

  }

  ngOnInit() {
  }

  // openURL() {
  //   if (this.firstTime) {
  //     console.log('fun');
  //     this.firstTime = false
  //     // return this.sanitizer.bypassSecurityTrustResourceUrl("https://inet-tmsolutions.com/BHApps/addmed.aspx?" + this.refid);
  //     return this.sanitizer.bypassSecurityTrustResourceUrl("https://inet-tmsolutions.com/BHApps/register?");
  //   }
  // }

  async showLoading() {
    const loading = await this.loadingController.create({
      message: 'Please Wait ...',
      duration: 5000
    });
    await loading.present();
  }


  goBack(){
    this.router.navigate(['landing'])
  }
}
