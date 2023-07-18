import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(mobileNo) {
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
        .set('Phoneno', mobileNo);

      this.http
        .post(
          // "https://inet-tmsolutions.com/WCFMedhelphand/MedService.asmx/loginbiodata",
          "https://inet-tmsolutions.com/WCFMedHelpHand/MedService.asmx/sOralloginbiodata",
          payLoad,
        )
        .toPromise()
        .then(async (response: any) => {
          var data = response;
          // console.log('data', data);
          resolve(data);

          if (data.MyBiodata) {
            // console.log('data.MyBiodata', data.MyBiodata[0].Return);
            return data.MyBiodata[0]
          }

        })
        .catch((err) => {
          console.log(err);
          resolve(err);
        });
    });
  }

  loadMedicineTimetable(refid) {
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
          "https://inet-tmsolutions.com/WCFMedhelphand/MedService.asmx/medtimetable",
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
}
