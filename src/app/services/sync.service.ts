import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { LocalStorage } from "@ngx-pwa/local-storage";
import { LoadingController, ToastController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';


@Injectable({
  providedIn: 'root'
})
export class SyncService {
  batchDetails: any;
  mymedpostvalue = [];
  values: any;
  mymedtaken = [];
  private _user: any;
  timeTable: any;
  loading: HTMLIonLoadingElement;
  user: any;
  Refid: any;

  constructor(public sanitizer: DomSanitizer, public toastController: ToastController, public loadingController: LoadingController, public http: HttpClient, public data: DataService, public localStorage: LocalStorage) {
    this.data.getUser()
    this._user = this.data.user
  }


  getCurrentMedicineList(refid) {
    return new Promise(async (resolve, reject) => {
      // console.log("login process started");


      let headers: Headers = new Headers();

      const httpOptions: any = {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: "text/xml",
          "Response-Type": "text/xml",
        }),
        responseType: "text",
      };

      const payLoad = new HttpParams()

        .set('Tokenid', 'MEDHOST')
        .set('tokenpass', 'MeD@2022')
        .set('refid', refid);

      this.http
        .post(
          "https://inet-tmsolutions.com/WCFMedhelphand/MedService.asmx/mymedcurrentlist",
          payLoad,
        )
        .toPromise()
        .then(async (response: any) => {
          var data = response;
          // console.log('data', data);
          resolve(data);

          // if (data.MyBiodata) {
          //   console.log('data.MyBiodata', data.MyBiodata[0].Return);
          return data.MyMedList
          // }

        })
        .catch((err) => {
          // console.log(err);
          resolve(err);
        });
    });
  }


  async updateBatchNo(refid, batchno, postvalue) {

    return new Promise(async (resolve, reject) => {
      this.batchDetails = {
        refid: refid,
        batchno: batchno,
        postvalue: postvalue
      }
      this.mymedpostvalue.push(this.batchDetails)
      let values = {
        mymedpostvalue: this.mymedpostvalue
      }

      let _payload = JSON.stringify(values)

      let body = new URLSearchParams()
      // let body: any
      body.set("json", _payload)
      let updateUrl = 'https://inet-tmsolutions.com/WCFMedhelphand/MedService.asmx/medupdatepostvalueusingjson';

      const opts = {
        headers: new HttpHeaders({
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        }),
      };

      this.http
        .post(updateUrl, body, opts)
        .toPromise()
        .then((response: any) => {
          var data = response;

          resolve(data);
        })
        .catch((err) => {
          // console.log(err);
          reject(err);
        });
    });
  }

  async sendDataToServer() {
    return new Promise(async (resolve, reject) => {

      this.loading = await this.loadingController.create({
        message: 'Please Wait',
      });
      await this.loading.present();
      this.timeTable = null;
      let data: any;
      this.localStorage.getItem('-timeTable-').subscribe((val) => {
        // console.log(val);
        this.timeTable = val
        if (this.timeTable !== null) {


          this.mymedtaken = []
          this.data.getTimeTable()
          this._user = this.data.user
          let _timetable = this.timeTable
          if (_timetable) {
            _timetable.forEach(element => {
              if (element.taken == "Taken") {
                let _obj = {
                  "refid": this._user.Refid,
                  "id": element.Id,
                  "taken": 1,
                  "Takendatetime": element.timeOfAction
                }
                this.mymedtaken.push(_obj)
              } else if (element.taken == "Skipped") {
                let _obj = {
                  "refid": this._user.Refid,
                  "id": element.Id,
                  "taken": 2,
                  "Takendatetime": element.timeOfAction
                }
                this.mymedtaken.push(_obj)
              } else if (element.taken == "toNotTaken") {
                let _obj = {
                  "refid": this._user.Refid,
                  "id": element.Id,
                  "taken": 3,
                  "Takendatetime": element.timeOfAction
                }
                this.mymedtaken.push(_obj)
              } else {
                let _obj = {
                  "refid": this._user.Refid,
                  "id": element.Id,
                  "taken": 0,
                }
                this.mymedtaken.push(_obj)
              }
            });
            this.mymedtaken.forEach(data => {
              // console.log(data.taken);

            })

            // console.log('this.mymedtaken', this.mymedtaken.length);
            // const unique = [...new Set(this.mymedtaken.map(item => item.id))];
            // console.log('this.mymedtaken - unique', unique.length)


            let _values = {
              mymedtaken: this.mymedtaken
            }

            let __payload = JSON.stringify(_values)

            let body = new URLSearchParams()
            // let body: any
            body.set("json", __payload);
            body.set("Tokenid", 'MEDHOST');
            body.set("tokenpass", 'MeD@2022');
            let updateUrl = 'https://inet-tmsolutions.com/WCFMedhelphand/MedService.asmx/mymedtakenupdateusingjson';

            const opts = {
              headers: new HttpHeaders({
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json",
              }),
            };

            this.http
              .post(updateUrl, body, opts)
              .toPromise()
              .then(async (response: any) => {
                var data = response;

                resolve(data);
                await this.loading.dismiss();
              })
              .catch(async (err) => {
                await this.loading.dismiss();
                let error_toast = await this.toastController.create({
                  message: 'Please check internet connection ❗❗❗',
                  duration: 3000,
                });
                error_toast.present();
                // console.log(err);
                reject(err);
              });

          }
          // console.log('this.mymedtaken', this.mymedtaken);
        }
      });
    });
  }

  async continueMedicine(ItemNo) {
    return new Promise(async (resolve, reject) => {
      this._user = this.data.user


      // let _ItemNo = JSON.stringify(ItemNo)
      let _ItemNo = "itemno=" + ItemNo
      // let _refid = JSON.stringify(this._user.Refid)
      let _refid = "refid=" + this._user.Refid

      let body = new URLSearchParams()

      body.set("refid", _refid);
      body.set("Itemno", _ItemNo);
      let contUrl = "https://inet-tmsolutions.com/BHApps/contmed.aspx?" + _refid + "&" + _ItemNo;

      const opts = {
        headers: new HttpHeaders({
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*"
        }),
      };
      this.http
        .post(contUrl, opts)
        .toPromise()
        .then(async (response: any) => {
          var data = response;

          resolve(data);
        })
        .catch(async (err) => {
          let error_toast = await this.toastController.create({
            message: 'Please check internet connection ❗❗❗',
            duration: 3000,
          });
          error_toast.present();
          // console.log(err);
          reject(err);
        });
    })
  }

  medTimetableForList() {
    this.localStorage.getItem('-user-').subscribe((val) => {
      this._user = val
      // console.log(val);
    })
    // this._user = this.data.user
    let _refid = this._user.Refid
    return new Promise(async (resolve, reject) => {
      // console.log("login process started");


      let headers: Headers = new Headers();

      const httpOptions: any = {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: "text/xml",
          "Response-Type": "text/xml",
        }),
        responseType: "text",
      };

      const payLoad = new HttpParams()

        .set('Tokenid', 'MEDHOST')
        .set('tokenpass', 'MeD@2022')
        .set('refid', _refid);

      this.http
        .post(
          "https://inet-tmsolutions.com/WCFMedhelphand/MedService.asmx/mymedcurrentlist",
          payLoad,
        )
        .toPromise()
        .then(async (response: any) => {
          var data = response;
          // console.log('data', data);
          resolve(data);

          // if (data.MyBiodata) {
          //   console.log('data.MyBiodata', data.MyBiodata[0].Return);
          return data.MyTimetable
          // }

        })
        .catch((err) => {
          // console.log(err);
          resolve(err);
        });
    });
  }

  loadNewTimeTable(refid) {
    return new Promise(async (resolve, reject) => {
      // console.log("login process started");


      let headers: Headers = new Headers();

      const httpOptions: any = {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: "text/xml",
          "Response-Type": "text/xml",
        }),
        responseType: "text",
      };

      const payLoad = new HttpParams()

        .set('Tokenid', 'MEDHOST')
        .set('tokenpass', 'MeD@2022')
        .set('refid', refid);

      this.http
        .post(
          "https://inet-tmsolutions.com/WCFMedhelphand/MedService.asmx/medtimetableforlist",
          payLoad,
        )
        .toPromise()
        .then(async (response: any) => {
          var data = response;
          // console.log('data', data);
          resolve(data);

          // if (data.MyBiodata) {
          //   console.log('data.MyBiodata', data.MyBiodata[0].Return);
          return data.MyTimetable
          // }

        })
        .catch((err) => {
          // console.log(err);
          resolve(err);
        });
    });
  }

  loadMyMovielink(Date, Slot) {
    return new Promise(async (resolve, reject) => {
      // console.log("login process started");


      let headers: Headers = new Headers();

      const httpOptions: any = {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: "text/xml",
          "Response-Type": "text/xml",
        }),
        responseType: "text",
      };

      const payLoad = new HttpParams()

        .set('Tokenid', 'MEDHOST')
        .set('tokenpass', 'MeD@2022')
        .set('Date', Date)
        .set('Slot', Slot)

      this.http
        .post(
          "https://inet-tmsolutions.com/WCFMedHelpHand/MedService.asmx/mymovielink",
          payLoad,
        )
        .toPromise()
        .then(async (response: any) => {
          var data = response;
          // console.log('data', data);
          resolve(data);

          // if (data.MyBiodata) {
            // console.log(data);
          // return data.MyTimetable
          // }

        })
        .catch((err) => {
          // console.log(err);
          resolve(err);
        });
    });
  }


  async updateDailyTransaction(Sessiontype, Status) {
    await this.localStorage.getItem('-user-').subscribe((val) => {
      // console.log(val);
      this.user = val
      this.Refid = this.user.Refid
    });
    let _Date = new Date().toISOString()
    return new Promise(async (resolve, reject) => {
      // console.log("login process started");


      let headers: Headers = new Headers();

      const httpOptions: any = {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: "text/xml",
          "Response-Type": "text/xml",
        }),
        responseType: "text",
      };

      const payLoad = new HttpParams()

        .set('Tokenid', 'MEDHOST')
        .set('tokenpass', 'MeD@2022')
        .set('Refid', this.Refid)
        .set('Date', _Date)
        .set('Sessiontype', Sessiontype)
        .set('Status', Status);

      this.http
        .post(
          "https://inet-tmsolutions.com/WCFMedHelpHand/MedService.asmx/sOralDailyCapture",
          payLoad,
        )
        .toPromise()
        .then(async (response: any) => {
          var data = response;
          console.log('data', data);
          resolve(data);


        })
        .catch((err) => {
          console.log(err);
          resolve(err);
        });
    });
  }

  // async getUser() {
  //   let data: any;
  //   await this.localStorage.getItem('-user-').subscribe((val) => {
  //     // console.log(val);
  //     this.user = val
  //   });
  //   return data
  // }


  getVideoLink(slot) {
    return new Promise(async (resolve, reject) => {

      const payLoad = new HttpParams()

        .set('Tokenid', 'MEDHOST')
        .set('tokenpass', 'MeD@2022')
        .set('Slot', slot);

      this.http
        .post(
          "https://inet-tmsolutions.com/WCFMedHelpHand/MedService.asmx/sOralmovielink",
          payLoad,
        )
        .toPromise()
        .then(async (response: any) => {
          var data = response;
          resolve(data);

          if (data) {
            return data
          }

        })
        .catch((err) => {
          console.log(err);
          resolve(err);
        });
    });
  }
  async getOralProformance() {
    await this.localStorage.getItem('-user-').subscribe((val) => {
      // console.log(val);
      this.user = val
      this.Refid = this.user.Refid
    });
    return new Promise(async (resolve, reject) => {

      const payLoad = new HttpParams()

        .set('Tokenid', 'MEDHOST')
        .set('tokenpass', 'MeD@2022')
        .set('Refid', this.Refid)

      this.http
        .post(
          "https://inet-tmsolutions.com/WCFMedHelpHand/MedService.asmx/sOralProformance",
          payLoad,
        )
        .toPromise()
        .then(async (response: any) => {
          var data = response;
          resolve(data);

          if (data) {
            return data
          }

        })
        .catch((err) => {
          console.log(err);
          resolve(err);
        });
    });
  }
}
