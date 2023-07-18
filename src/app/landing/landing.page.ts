import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';
import { SyncService } from '../services/sync.service';
import { ActionPerformed, CancelOptions, LocalNotifications, LocalNotificationSchema } from '@capacitor/local-notifications'
import { v4 as uuidv4 } from 'uuid';
// import SampleJson from './timetable_one.json';
import { LocalStorage } from "@ngx-pwa/local-storage";
import { log } from 'console';



@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {
  loading: HTMLIonLoadingElement;
  Refid: any;
  public idNumber: any;
  myTimeTable: any;
  distinctBatch: any;
  private _user: any;
  mymedpostvalue: any[];
  public timetable
  pendings: any;
  userName: any;
  pendingList: boolean;
  localUser: any;
  markedStatus: boolean;
  notMarkedStatus: boolean;
  myInterval: any;

  video = document.getElementById("player") as HTMLVideoElement;
  isModalOpen: any;
  showButton: boolean;
  url: Promise<unknown>;
  slot: string;
  date;
  item: any = {
    name: 'Sample Item',
    avgRating: 4.5,
    numRatings: 10,
  };
  scheduled: unknown;
  link1: any;
  link2: any;
  array8Am = [];
  totalScore: any;
  starColor: any;
  score = 90;
  showStar: number;

  constructor(public localStorage: LocalStorage, public sync: SyncService, public toastController: ToastController, public auth: AuthService, public router: Router, public data: DataService, public loadingController: LoadingController) {
    // setTimeout(() => {
    //   this.getPendingsAndFilterTimetable()
    // }, 3000);

    this.getItem()
    this.isModalOpen = false;


    let date = new Date(); // create a new Date object for the current date and time
    const hour = date.getHours(); // get the current hour
    
    if (hour < 12) {
      this.slot = "M"
    } else if (hour < 18) {
      this.slot = "A"
    } else {
      this.slot = "E"
        }
      this.date = date.toISOString().substring(0, 10); // convert the date to ISO format and extract the yyyy-mm-dd part

        console.log('dadadate',this.date); // log the formatted date to the console
 
        LocalNotifications.addListener('localNotificationActionPerformed', (notification: ActionPerformed) => {

          let idClicked = notification.notification.id

          if (idClicked <49) {
            this.router.navigate(['video', { 'notification_id': notification.notification.id ,'notification_actionId': notification.actionId}])
          } else if(idClicked > 49 && idClicked <99){
            this.router.navigate(['video-two', { 'notification_id': notification.notification.id ,'notification_actionId': notification.actionId}])
          }
        })
      
      }

  async ngOnInit() {
    await LocalNotifications.requestPermissions()
    // this.myInterval = setInterval(() => {
    //   // console.log("Set checkPendings Running");
    //   this.checkPendings();
    // }, 1000 * 5);
    // console.log('landing');

    // this.timetable = await this.getTimeTablefromLocal()

    // await this.localStorage.getItem('-user-').subscribe((val) => {
    //   // console.log(val);
    //   this._user = val
    //   this.userName = this._user.Name
    //   // console.log(this.userName);
    // })
    // this.data.getTimeTable()

    this.sync.getVideoLink("1").then((data: any) =>{
      // console.log(data);
      this.link1 = data.MyMovielink[0].Movielink

      this.data.setItem('-link1-', this.link1)
      // console.log(data.MyMovielink[0].Movielink);
    })
    
    this.sync.getVideoLink("2").then((data: any) =>{
      // console.log(data);
      this.link2 = data.MyMovielink[0].Movielink
      this.data.setItem('-link2-', this.link2)
      // console.log(data.MyMovielink[0].Movielink);
    })
    this.sync.getOralProformance().then((data: any) =>{
      console.log('dddddddd',data.MyOralPro[0].total);
      this.totalScore = data.MyOralPro[0].total
      this.data.setItem('-totalScore-', this.totalScore)
      if (this.totalScore>= 80) {
        this.starColor = 'gold';
        this.showStar = 5
      } else if (this.totalScore>= 60) {
        this.starColor = 'green';
        this.showStar = 4
      } else if (this.totalScore>= 40) {
        this.starColor = 'yellow';
        this.showStar = 3;
      } else if (this.totalScore>= 20) {
        this.starColor = 'orange';
        this.showStar = 2
      } else {
        this.starColor = 'red'
        this.showStar = 1
      }
      
      let starRatingValue = this.totalScore/20

      this.item.avgRating = starRatingValue
      console.log('avg',this.item.avgRating);
      
      
    })
    this.loading = await this.loadingController.create({
      message: 'Please Wait',
    });

    // LocalNotifications.registerActionTypes({
    //   types: [
    //     {
    //       id: 'ACTION',
    //       actions: [
    //         {
    //           id: 'yes',
    //           title: 'Sudah'
    //         },
    //         {
    //           id: 'no',
    //           title: 'Belum'
    //         }
    //       ]
    //     }
    //   ]
    // })
  }

  getStarColor(score: number, starNumber: number) {
    
    if (this.totalScore>= 80) {
      return 'star-gold'
    } else if (this.totalScore>= 60) {
      return 'star-green';
    } else if (this.totalScore>= 40) {
      return 'star-yellow';
    } else if (this.totalScore>= 20) {
      return 'star-orange';
    } else {
      return 'star-red';
    }
  }

  ionViewDidEnter() {
    this.setAlarmAt8()
        this.setAlarmAt1130()
        this.setAlarmAt18()

        this.setAlarmAt815()
        this.setAlarmAt830()
        this.setAlarmAt930()
        this.setAlarmAt1030()

        this.setAlarmAt1815()
        this.setAlarmAt1830()
        this.setAlarmAt1930()
        this.setAlarmAt2030()

        this.setAlarmAt730()
  }

  manualNotify() {
    LocalNotifications.schedule({
      notifications: [
        {
          title: "Itemname",
          body: "Please have",
          id: 33,
          extra: { data: "0000" },
          // schedule: { at: new Date(tableFormatedDate), allowWhileIdle: true }
          schedule: { at: new Date(Date.now() + 1000 * 6), allowWhileIdle: true },
          // sound: 'organfinale.wav',
          channelId:'manualAlerts'
        }
      ]
    })
  }

  async goToRekod() {
    // this.refresh()
      this.router.navigate(['rekod'])
  }
  async goToRekod2() {
    // this.refresh()
    console.log(2);
    
      this.router.navigate(['video-two'])
  }
  goToVideo() {
    this.router.navigate(['video'])
  }

  logout() {
    this.data.removeAll()
    this.router.navigate(['login'])
  }

  async reCallTimeTable() {
  }

  async refresh() {
    // LocalNotifications.schedule
  }
  getPendingsAndFilterTimetable() {
  }
  async setNotifications() {
  }
  setOpen(){
    this.isModalOpen = false;
  }

  startVideo(){
    this.isModalOpen = true
  }

  async setItem() {
    await this.localStorage.setItem('-scheduled-', true).subscribe(() => { });
  }

  async getItem() {
    await this.localStorage.getItem('-scheduled-').subscribe((val) => {
      // console.log(val);
      this.scheduled = val
    });
  }


  // 8, 00
  // 11, 30
  // 18, 00

  // 8, 15
  // 8, 30
  // 9, 30
  // 10, 30
  // 18, 15
  // 18, 30
  // 19, 30
  // 20, 30
  
  // 7, 30

  //Mapping
  //Notification Id 1-50 Morning Alarm for video 1
  //Notification Id 50-100 Evening Alarm for video 2
  //Notification Id 100-200 Morning Alarm for Action
  //Notification Id 200-300 Evening Alarm for Action
  //Notification Id 1000+ Morning Alarm for Greeting
  // 1-100
  setAlarmAt8(){
        const currentDate = new Date();

        for (let i = 0; i < 6; i++) {
          // Calculate the date for the notification
          const notificationDate = new Date(currentDate);
          notificationDate.setDate(currentDate.getDate() + i);
          notificationDate.setHours(8, 0, 0);

          
        
        if (currentDate < notificationDate) {
          LocalNotifications.schedule({
            notifications: [
              {
                // sound: './sounds/organfinale.wav',
                // sound: 'organfinale.wav',
                title: "Hi Selamat Pagi",
                body: "Tolong gosok gigi",
                id: i,
                //1,2,3,4,5
                // actionTypeId: 'ACTION',
                extra: { data: i },
                schedule: { at: new Date(notificationDate), allowWhileIdle: true },
         
                channelId:'manualAlerts'
              }
            ],
          })
        }
        }
  }
  setAlarmAt1130(){
        const currentDate = new Date();

        for (let i = 0; i < 6; i++) {
          // Calculate the date for the notification
          const notificationDate = new Date(currentDate);
          notificationDate.setDate(currentDate.getDate() + i);
          notificationDate.setHours(11, 30, 0);
          let j = i+20
          
        
        if (currentDate < notificationDate) {
          LocalNotifications.schedule({
            notifications: [
              {
                // sound: './sounds/organfinale.wav',
                // sound: 'organfinale.wav',
                title: "Hi Selamat Pagi",
                body: "Tolong gosok gigi",
                id: j,
                //1,2,3,4,5
                // actionTypeId: 'ACTION',
                extra: { data: j },
                schedule: { at: new Date(notificationDate), allowWhileIdle: true },
         
                channelId:'manualAlerts'
              }
            ],
          })
        }
        }
  }
  setAlarmAt18(){
        const currentDate = new Date();

        for (let i = 0; i < 6; i++) {
          // Calculate the date for the notification
          const notificationDate = new Date(currentDate);
          notificationDate.setDate(currentDate.getDate() + i);
          notificationDate.setHours(18, 0, 0);

          let j = i+50
          
        
        if (currentDate < notificationDate) {
          LocalNotifications.schedule({
            notifications: [
              {
                // sound: './sounds/organfinale.wav',
                // sound: 'organfinale.wav',
                title: "Hi selamat tengah hari",
                body: "Tolong gosok gigi",
                id: j,
                //1,2,3,4,5
                // actjonTypeId: 'ACTION',
                extra: { data: i },
                schedule: { at: new Date(notificationDate), allowWhileIdle: true },
         
                channelId:'manualAlerts'
              }
            ],
          })
        }
        }
  }

    // 100-200

  setAlarmAt815(){
        const currentDate = new Date();

        for (let i = 0; i < 6; i++) {
          // Calculate the date for the notification
          const notificationDate = new Date(currentDate);
          notificationDate.setDate(currentDate.getDate() + i);
          notificationDate.setHours(8, 15, 0);

          let j = i+ 100
          
        
        if (currentDate < notificationDate) {
          LocalNotifications.schedule({
      notifications: [
        {
          // sound: './sounds/organfinale.wav',
          // sound: 'organfinale.wav',
          title: "Hi",
          body: "Anda sudah gosok gigi?.",
          id: j,
          // actionTypeId: 'ACTION',
          extra: { data: j },
          schedule: { at: new Date(notificationDate), allowWhileIdle: true },   
          channelId:'manualAlerts'
        }
      ],
    })
        }
        }
  }
  setAlarmAt830(){
        const currentDate = new Date();

        for (let i = 0; i < 6; i++) {
          // Calculate the date for the notification
          const notificationDate = new Date(currentDate);
          notificationDate.setDate(currentDate.getDate() + i);
          notificationDate.setHours(8, 30, 0);
          
          let j = i+ 120

          
        
        if (currentDate < notificationDate) {
          LocalNotifications.schedule({
      notifications: [
        {
          // sound: './sounds/organfinale.wav',
          // sound: 'organfinale.wav',
          title: "Hi",
          body: "Anda sudah gosok gigi?.",
          id: j,
          // actionTypeId: 'ACTION',
          extra: { data: j },
          schedule: { at: new Date(notificationDate), allowWhileIdle: true },   
          channelId:'manualAlerts'
        }
      ],
    })
        }
        }
  }
  setAlarmAt930(){
        const currentDate = new Date();

        for (let i = 0; i < 6; i++) {
          // Calculate the date for the notification
          const notificationDate = new Date(currentDate);
          notificationDate.setDate(currentDate.getDate() + i);
          notificationDate.setHours(9, 30, 0);

          let j = i+ 140

          
        
        if (currentDate < notificationDate) {
          LocalNotifications.schedule({
      notifications: [
        {
          // sound: './sounds/organfinale.wav',
          // sound: 'organfinale.wav',
          title: "Hi",
          body: "Anda sudah gosok gigi?.",
          id: j,
          // actionTypeId: 'ACTION',
          extra: { data: j },
          schedule: { at: new Date(notificationDate), allowWhileIdle: true },   
          channelId:'manualAlerts'
        }
      ],
    })
        }
        }
  }
  setAlarmAt1030(){
        const currentDate = new Date();

        for (let i = 0; i < 6; i++) {
          // Calculate the date for the notification
          const notificationDate = new Date(currentDate);
          notificationDate.setDate(currentDate.getDate() + i);
          notificationDate.setHours(10, 30, 0);

          let j = i+ 160

          
        
        if (currentDate < notificationDate) {
          LocalNotifications.schedule({
      notifications: [
        {
          // sound: './sounds/organfinale.wav',
          // sound: 'organfinale.wav',
          title: "Hi",
          body: "Anda sudah gosok gigi?.",
          id: j,
          // actionTypeId: 'ACTION',
          extra: { data: j },
          schedule: { at: new Date(notificationDate), allowWhileIdle: true },   
          channelId:'manualAlerts'
        }
      ],
    })
        }
        }
  }

    // 200-300

  setAlarmAt1815(){
        const currentDate = new Date();

        for (let i = 0; i < 6; i++) {
          // Calculate the date for the notification
          const notificationDate = new Date(currentDate);
          notificationDate.setDate(currentDate.getDate() + i);
          notificationDate.setHours(18, 15, 0);

          let j = i+ 200

          
        
        if (currentDate < notificationDate) {
          LocalNotifications.schedule({
      notifications: [
        {
          // sound: './sounds/organfinale.wav',
          // sound: 'organfinale.wav',
          title: "Hi",
          body: "Anda sudah gosok gigi?.",
          id: j,
          // actionTypeId: 'ACTION',
          extra: { data: j },
          schedule: { at: new Date(notificationDate), allowWhileIdle: true },   
          channelId:'manualAlerts'
        }
      ],
    })
        }
        }
  }
  setAlarmAt1830(){
        const currentDate = new Date();

        for (let i = 0; i < 6; i++) {
          // Calculate the date for the notification
          const notificationDate = new Date(currentDate);
          notificationDate.setDate(currentDate.getDate() + i);
          notificationDate.setHours(18, 30, 0);

          let j = i+ 220

          
        
        if (currentDate < notificationDate) {
          LocalNotifications.schedule({
      notifications: [
        {
          // sound: './sounds/organfinale.wav',
          // sound: 'organfinale.wav',
          title: "Hi",
          body: "Anda sudah gosok gigi?.",
          id: j,
          // actionTypeId: 'ACTION',
          extra: { data: j },
          schedule: { at: new Date(notificationDate), allowWhileIdle: true },   
          channelId:'manualAlerts'
        }
      ],
    })
        }
        }
  }
  setAlarmAt1930(){
        const currentDate = new Date();

        for (let i = 0; i < 6; i++) {
          // Calculate the date for the notification
          const notificationDate = new Date(currentDate);
          notificationDate.setDate(currentDate.getDate() + i);
          notificationDate.setHours(19, 30, 0);

          let j = i+ 240

          
        
        if (currentDate < notificationDate) {
          LocalNotifications.schedule({
      notifications: [
        {
          // sound: './sounds/organfinale.wav',
          // sound: 'organfinale.wav',
          title: "Hi",
          body: "Anda sudah gosok gigi?.",
          id: j,
          // actionTypeId: 'ACTION',
          extra: { data: j },
          schedule: { at: new Date(notificationDate), allowWhileIdle: true },   
          channelId:'manualAlerts'
        }
      ],
    })
        }
        }
  }
  setAlarmAt2030(){
        const currentDate = new Date();

        for (let i = 0; i < 6; i++) {
          // Calculate the date for the notification
          const notificationDate = new Date(currentDate);
          notificationDate.setDate(currentDate.getDate() + i);
          notificationDate.setHours(20, 30, 0);

          let j = i+ 260

          
        
        if (currentDate < notificationDate) {
          LocalNotifications.schedule({
      notifications: [
        {
          // sound: './sounds/organfinale.wav',
          // sound: 'organfinale.wav',
          title: "Hi",
          body: "Anda sudah gosok gigi?.",
          id: j,
          // actionTypeId: 'ACTION',
          extra: { data: j },
          schedule: { at: new Date(notificationDate), allowWhileIdle: true },   
          channelId:'manualAlerts'
        }
      ],
    })
        }
        }
  }

// 1000 -1100

  setAlarmAt730(){
        const currentDate = new Date();

        for (let i = 0; i < 6; i++) {
          // Calculate the date for the notification
          const notificationDate = new Date(currentDate);
          notificationDate.setDate(currentDate.getDate() + i);
          notificationDate.setHours(7, 30, 0);

          let j = i+ 1000

          
        
        if (currentDate < notificationDate) {
   LocalNotifications.schedule({
      notifications: [
        {
          // sound: './sounds/organfinale.wav',
          // sound: 'organfinale.wav',
          title: "Hi",
          body: "Semoga hari anda indah.",
          id: j,
          // actionTypeId: 'ACTION',
          extra: { data:  j},
          schedule: { at: new Date(notificationDate), allowWhileIdle: true },
          channelId:'manualAlerts'
        }
      ],
    })
        }
        }
  }

}


