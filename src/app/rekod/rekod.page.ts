import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-rekod',
  templateUrl: './rekod.page.html',
  styleUrls: ['./rekod.page.scss'],
})
export class RekodPage implements OnInit {

  firstTime: any;
  public _user: any;
  refid: string | undefined;
  itemNo: string | null | undefined;url: string;
  private _itemNo: string;
;

  constructor(public data: DataService, public loadingController: LoadingController, public route: ActivatedRoute, public router:Router) {
    this.showLoading()
  }

  async ngOnInit() {
    // this.itemNo = await this.route.snapshot.paramMap.get("data")
    this._itemNo = this.route.snapshot.paramMap.get("itemNo");

    // console.log(this.itemNo);

    this.firstTime = true
    this._user = this.data.user
    this.refid = "refid=" + this._user.Refid
    this.itemNo = "itemno=" + this._itemNo

    this.url = "https://inet-tmsolutions.com/BHApps/oralhistory.aspx?"+ this.refid
    // this.url = "https://inet-tmsolutions.com/BHApps/oralregister.aspx?"+ this.refid

  }

  // openURL() {
  //   if (this.firstTime) {
  //     console.log('fun');
  //     this.firstTime = false
  //     // return this.sanitizer.bypassSecurityTrustResourceUrl("https://inet-tmsolutions.com/BHApps/addmed.aspx?" + this.refid);
  //     return this.sanitizer.bypassSecurityTrustResourceUrl("https://inet-tmsolutions.com/BHApps/contmed.aspx?" + this.refid + "&" + this.itemNo);
  //     // return this.sanitizer.bypassSecurityTrustStyle("https://inet-tmsolutions.com/BHApps/contmed.aspx?" + this.refid + "&" + this.itemNo);
  //   }
  // }

  async showLoading() {
    const loading = await this.loadingController.create({
      message: 'Please Wait ...',
      duration: 2000
    });
    await loading.present();
  }

  goBack(){
    this.router.navigate(['landing'])
  }

}
