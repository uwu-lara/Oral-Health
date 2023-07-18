import { Injectable } from '@angular/core';
import { LocalStorage } from "@ngx-pwa/local-storage";


@Injectable({
  providedIn: 'root'
})
export class DataService {

  public timeTable;
  user: unknown;
  firedNotification: unknown;
  constructor(public localStorage: LocalStorage) { }

  async setItem(key: any, item: any) {
    await this.localStorage.setItem(key, item).subscribe(() => { });
  }

  async getItem(key: any) {
    let data: any;
    await this.localStorage.getItem(key).subscribe((val) => {
      // console.log(val);
      data = val
    });
    return data
  }
  async getTimeTable() {
    let data: any;
    await this.localStorage.getItem('-timeTable-').subscribe((val) => {
      // console.log(val);
      this.timeTable = val
    });
    return data
  }
  async getUser() {
    let data: any;
    await this.localStorage.getItem('-user-').subscribe((val) => {
      // console.log(val);
      this.user = val
    });
    return data
  }

  async removeAll() {
    this.localStorage.clear().subscribe(() => { });
  }

  async getFiredNotification() {
    let data: any;
    await this.localStorage.getItem('-firedNotification-').subscribe((val) => {
      // console.log(val);
      this.firedNotification = val
    });
    return data
  }
}
