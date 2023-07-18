import { Component, OnInit } from '@angular/core';
import { ActionPerformed, CancelOptions, LocalNotifications, LocalNotificationSchema } from '@capacitor/local-notifications'
import { DataService } from '../services/data.service';
import { v4 as uuidv4 } from 'uuid';
import { AlertController, Platform } from '@ionic/angular';
import { SyncService } from '../services/sync.service';
import { ActivatedRoute, Router } from '@angular/router';
// import SampleJson from './timetable.json';
import { LocalStorage } from "@ngx-pwa/local-storage";




@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  timetable: any;
  today: any;
  selectedDate: any;
  filteredTable = []
  takenSessions = [];
  skippedSessions = [];
  user: any;
  // userName: any;
  firedNotificaionId: any;
  pendings: any;
  ckickSub: any;
  notificationClicked: string;
  desiredArray: unknown[];
  notification_actionId: string;

  constructor(public localStorage: LocalStorage,public route: ActivatedRoute, public platform: Platform, public data: DataService, private alertController: AlertController, public sync: SyncService, public router: Router) {
    this.today = new Date().toISOString()
    console.log(this.today);
    // console.log(SampleJson);

  }

  async ngOnInit() {
    LocalNotifications.registerActionTypes({
      types: [
        {
          id: 'ACTION',
          actions: [
            {
              id: 'taken',
              title: 'Taken'
            },
            {
              id: 'toNotTaken',
              title: 'Not Taken'
            },
            {
              id: 'Skipped',
              title:'Later'
            }
          ]
        }
      ]
    })
    this.notificationClicked = this.route.snapshot.paramMap.get('notification_id')
    this.notification_actionId = this.route.snapshot.paramMap.get('notification_actionId')
    // this.data.getTimeTable()
    this.data.getUser()
    this.timetable = await this.getTimeTablefromLocal()
    // this.timetable = this.data.timeTable
    this.user = await this.getUser()
    this.user = await this.data.user
    console.log(this.user);
    // this.userName = this.user.Name

    // LocalNotifications.addListener('localNotificationActionPerformed', (notification: ActionPerformed) => {

    //   console.log('LocalNotifications.addListener: HOME');
      
    //   let idClicked = notification.notification.id
    //   let idToCancel = idClicked + '0000'
    //   this.cancelNotification(+idToCancel)
    //   // this.markNotification(this.firedNotificaionId)
    //   console.log('idClicked', notification.actionId);
    //   console.log('notification', notification);
    //   this.router.navigate(['home']);

    //   // let _dateStringToFilter = notification.notification.body
    //   // let _dateSubToFilter = _dateStringToFilter.substring(0, 10);
    //   // let splitedDate = _dateSubToFilter.split("/");
    //   // let _date = splitedDate[0]
    //   // let _month = splitedDate[1]
    //   // let _year = splitedDate[2]
    //   // let reorderedDate = _month + "/" + _date + "/" + _year
    //   // let _dateToFilter = new Date(reorderedDate)
    //   // this.filterByDate(_dateToFilter,"")
      
    //   if (notification.actionId == 'taken') {
    //     this.markTakenById(this.firedNotificaionId)
    //   } else if (notification.actionId == 'toNotTaken') {
    //     this.markNotTakenById(this.firedNotificaionId)
    //   } else if (notification.actionId == 'Skipped') {
    //     this.markSkipById(this.firedNotificaionId)
    //   }
    // })

  }
  // async setNotifications() {
  //   console.log('setNotifications');
  //   let _currentDate = new Date()

  //   this.timetable.MyTimetable.forEach(item => {
  //     let splitedDate = item.Sessiondate.split("/");
  //     let _date = splitedDate[0]
  //     let _month = splitedDate[1]
  //     let _year = splitedDate[2]

  //     let split_time = item.Sessiontime.split(":");
  //     if (split_time[0].length === 1) {
  //       item.Sessiontime = '0' + item.Sessiontime;
  //     }

  //     let tableFormatedDate = _year + "-" + _month + "-" + _date + "T" + item.Sessiontime
  //     let _tableFormatedDate = new Date(tableFormatedDate)



  //     if (_currentDate > _tableFormatedDate) {
  //       console.log('currentDate');

  //     } if (_currentDate < _tableFormatedDate) {
  //       console.log('tableFormatedDate');

  //       let twoMinsLater = _tableFormatedDate.setMinutes(_tableFormatedDate.getMinutes() + 2);
  //       let snoozId = item.Id + '0000'

  //       LocalNotifications.schedule({
  //         notifications: [
  //           {
  //             sound: './sounds/organfinale.wav',
  //             title: item.Itemname,
  //             body: item.Sessiondate + "  " + item.Sessiontime + ". Hi " + this.userName + ", Please remember to take your medicine",
  //             id: item.Id,
  //             // actionTypeId: 'ACTION',
  //             extra: { data: item.Id, date: tableFormatedDate },
  //             schedule: { at: new Date(tableFormatedDate) }
  //             // schedule: { at: new Date(Date.now() + 1000 * 4) }

  //           }
  //         ]
  //       })
  //       LocalNotifications.schedule({
  //         notifications: [
  //           {
  //             sound: './sounds/organfinale.wav',
  //             title: item.Itemname,
  //             body: item.Sessiondate + " " + item.Sessiontime + ". Hi " + this.userName + ", Please remember to take your medicine",
  //             id: +snoozId,
  //             // actionTypeId: 'ACTION',
  //             extra: { data: +snoozId, date: tableFormatedDate },
  //             schedule: { at: new Date(twoMinsLater) }
  //             // schedule: { at: new Date(Date.now() + 1000 * 4) }

  //           }
  //         ]
  //       })
  //     }
  //   });

  // }


  onChange($event) {
    // console.log($event.detail.value);

    let _selectedDate = $event.detail.value

    this.filteredTable = []

    this.selectedDate = new Date(this.today).toISOString()
    // console.log('date', this.selectedDate);
    if (this.selectedDate && this.timetable) {
      // this.filterByDate(_selectedDate,"")
    }

  }

 async  ionViewDidEnter() {
    this.filteredTable = []
    this.getPendings()

    // this.getTimeTable()
    // console.log(this.user);
    // this.userName = await this.user.Name
    // console.log('this.notificationClicked', this.notificationClicked);
    if (this.notificationClicked) {
      let last4Digits = this.notificationClicked.slice(-4);
      if (last4Digits == '0000') {
        this.notificationClicked = this.notificationClicked.substring(0, this.notificationClicked.length - 4)
      }
      let _notificationClicked = +this.notificationClicked
      this.timetable.forEach(element => {
        if (element.Id == _notificationClicked) {
          let splitedDate = element.Sessiondate.split("/");
          let _date = splitedDate[0]
          let _month = splitedDate[1]
          let _year = splitedDate[2]
          let reorderedDate = _month + "/" + _date + "/" + _year
          let _dateToFilter = new Date(reorderedDate)
          setTimeout(() => {
            this.today = _dateToFilter
          }, 1000);

          if (this.notificationClicked) {
            // this.filterByDate(_dateToFilter,this.notificationClicked)
            this.filterById(this.notificationClicked)

            if (this.notification_actionId) {
              // console.log('this.notification_actionId',this.notification_actionId);
              
              if (this.notification_actionId == 'taken') {
                this.markTakenById(this.notificationClicked)
              } else if (this.notification_actionId == 'toNotTaken') {
                this.markNotTakenById(this.notificationClicked)
              } else if (this.notification_actionId == 'Skipped') {
                this.markSkipById(this.notificationClicked)
              }
            }
          } else{
            this.filterByDate(_dateToFilter,"")
          }
        }
      });
    } else {
      this.filterByDate(this.today,"")
    }

  }

  // async getTimeTable() {
  //   this.timetable = await this.data.getItem('-timeTable-')
  //   // this.timetable = this.data.timeTable
  //   console.log('home', this.timetable);
  //   if (this.timetable) {
  //     this.timetable.forEach(_session => {
  //       let uniqueId = uuidv4()
  //       if (!_session.uniqueId) {
  //         _session['uniqueId'] = uniqueId
  //       }
  //     });
  //     // this.getPendingsAndFilterTimetable()
  //   }

  // }

  filterByDate(date: any,notificationClicked) {
    if (this.timetable && this.timetable.length > 0) {
      this.timetable.forEach(item => {
        let splitedDate = item.Sessiondate.split("/");
        let _date = splitedDate[0]
        let _month = splitedDate[1]
        let _year = splitedDate[2]

        let tableFormatedDate = _year + "-" + _month + "-" + _date


        // let _isoDate = new Date(formatedDate).toISOString()
        let __date: any = new Date(date);
        let __year: any = __date.getFullYear();
        let __month: any = __date.getMonth() + 1;
        let __dt: any = __date.getDate();

        if (__dt < 10) {
          __dt = '0' + __dt;
        }
        if (__month < 10) {
          __month = '0' + __month;
        }

        let inputFormatedDate = __year + '-' + __month + '-' + __dt

        // console.log('tableFormatedDate', tableFormatedDate, 'inputFormatedDate', inputFormatedDate);

        if (tableFormatedDate == inputFormatedDate) {
          this.filteredTable.push(item)
        }
      })
      // let hashObject = {}
      // this.filteredTable.forEach(item =>{

      //   var key = item.ItemNo;
      //   if (hashObject[key]) {
      //     hashObject[key].push(item);
      //   } else {
      //     hashObject[key] = [item];
      //   }
      // })
//  this.desiredArray = Object.values(hashObject);

// console.log(this.desiredArray);
    }

    // console.log(this.filteredTable);
    if (notificationClicked) {
      this.filterById(notificationClicked)
    }
  }

  taken(session) {
    this.getPendings()
    let _date = new Date()
    let s_date = _date.toISOString()
    // console.log('s_date', s_date);

    session['taken'] = "Taken";
    session['timeOfAction'] = s_date;
    session['canceled'] = true;
    this.takenSessions.push(session)

    let idToCancel1 = session.Id
    let idToCancel2 = session.Id + '0000'
    this.cancelNotification(+idToCancel1)
    this.cancelNotification(+idToCancel2)
    // console.log(this.takenSessions);
    this.timetable = this.timetable.filter(_session => {
      return (_session.Id !== session.Id)
    })
    // this.cancelPendingById(session.Id)
    this.timetable.push(session)
    this.data.setItem('-timeTable-', this.timetable).then(data => {
      this.data.getTimeTable().then(_data => {
        // this.sync.sendDataToServer()
      })
    })


  }

  skip(session) {
    let _date = new Date()
    let s_date = _date.toISOString()
    session['taken'] = "Skipped"
    session['takenTxt'] = "Later"
    session['timeOfAction'] = s_date;
    session['canceled'] = true;

    this.skippedSessions.push(session)
    let idToCancel1 = session.Id
    let idToCancel2 = session.Id + '0000'
    this.cancelNotification(+idToCancel1)
    this.cancelNotification(+idToCancel2)
    // console.log(this.takenSessions);
    this.timetable = this.timetable.filter(_session => {
      return (_session.Id !== session.Id)
    })
    // this.cancelPendingById(+session.Id)
    this.timetable.push(session)
    this.data.setItem('-timeTable-', this.timetable).then(data => {
      this.data.getTimeTable().then(_data => {
        // this.sync.sendDataToServer()
      })
    })

  }

  notTaken(session) {
    let _date = new Date()
    let s_date = _date.toISOString()
    session['taken'] = "toNotTaken"
    session['takenTxt'] = "Not Taken"
    session['timeOfAction'] = s_date;
    session['canceled'] = true;

    this.skippedSessions.push(session)
    let idToCancel1 = session.Id
    let idToCancel2 = session.Id + '0000'
    this.cancelNotification(+idToCancel1)
    this.cancelNotification(+idToCancel2)
    // console.log(this.takenSessions);
    this.timetable = this.timetable.filter(_session => {
      return (_session.Id !== session.Id)
    })
    // this.cancelPendingById(+session.Id)
    this.timetable.push(session)
    this.data.setItem('-timeTable-', this.timetable).then(data => {
      this.data.getTimeTable().then(_data => {
        // this.sync.sendDataToServer()
      })
    })

  }

  dismiss() { }

  async presentAlertConfirm(session) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: session.Itemname,
      message: session.SessionSlot + ' Session. To take On ' + session.Sessiondate + ' At ' + session.Sessiontime + '. Please have ' + session.Sessionqty,
      buttons: [
        {
          text: 'Taken',
          id: 'confirm-button',
          handler: () => {
            this.taken(session);
            // console.log('Confirm Okay');
          }
        },
        {
          text: 'Not Taken',
          id: 'hold-button',
          handler: () => {
            this.notTaken(session);
            // console.log('Not taken');
          }
        },
        {
          text: 'Later',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah')
            this.skip(session)
          }
        }
      ]
    });

    await alert.present();
  }

  markTakenById(sessionId) {
    this.timetable.forEach(session => {
      if (sessionId == session.Id) {

        this.getPendings()
        let _date = new Date()
        let s_date = _date.toISOString()
        // console.log('s_date', s_date);
    
        session['taken'] = "Taken";
        session['timeOfAction'] = s_date;
        session['canceled'] = true;
        this.takenSessions.push(session)
    
        let idToCancel1 = session.Id
        let idToCancel2 = session.Id + '0000'
        this.cancelNotification(+idToCancel1)
        this.cancelNotification(+idToCancel2)
        // console.log(this.takenSessions);
        this.timetable = this.timetable.filter(_session => {
          return (_session.Id !== session.Id)
        })
        // this.cancelPendingById(session.Id)
        this.timetable.push(session)
        this.data.setItem('-timeTable-', this.timetable).then(data => {
          this.data.getTimeTable().then(_data => {
            this.sync.sendDataToServer()
          })
        })
    
    
        // session['taken'] = "Taken"
        // this.takenSessions.push(session)
        // console.log(this.takenSessions);
        // this.timetable = this.timetable.filter(_session => {
        //   return (_session.Id !== session.Id)
        // })

        // this.timetable.push(session)
        // this.data.setItem('-timeTable-', this.timetable)

      }
    })
    this.filterById(sessionId)
  }

  markSkipById(sessionId) {
    this.timetable.forEach(session => {
      if (sessionId == session.Id) {

        let _date = new Date()
    let s_date = _date.toISOString()
    session['taken'] = "Skipped"
    session['takenTxt'] = "Later"
    session['timeOfAction'] = s_date;
    session['canceled'] = true;

    this.skippedSessions.push(session)
    let idToCancel1 = session.Id
    let idToCancel2 = session.Id + '0000'
    this.cancelNotification(+idToCancel1)
    this.cancelNotification(+idToCancel2)
    // console.log(this.takenSessions);
    this.timetable = this.timetable.filter(_session => {
      return (_session.Id !== session.Id)
    })
    // this.cancelPendingById(+session.Id)
    this.timetable.push(session)
    this.data.setItem('-timeTable-', this.timetable).then(data => {
      this.data.getTimeTable().then(_data => {
        this.sync.sendDataToServer()
      })
    })

        // session['taken'] = "Skipped"
        // this.takenSessions.push(session)
        // console.log(this.takenSessions);
        // this.timetable = this.timetable.filter(_session => {
        //   return (_session.Id !== session.Id)
        // })

        // this.timetable.push(session)
        // this.data.setItem('-timeTable-', this.timetable)

      }
    })
    this.filterById(sessionId)
  }
  markNotTakenById(sessionId) {
    this.timetable.forEach(session => {
      if (sessionId == session.Id) {

        let _date = new Date()
        let s_date = _date.toISOString()
        session['taken'] = "toNotTaken"
        session['takenTxt'] = "Not Taken"
        session['timeOfAction'] = s_date;
        session['canceled'] = true;
    
        this.skippedSessions.push(session)
        let idToCancel1 = session.Id
        let idToCancel2 = session.Id + '0000'
        this.cancelNotification(+idToCancel1)
        this.cancelNotification(+idToCancel2)
        console.log(this.takenSessions);
        this.timetable = this.timetable.filter(_session => {
          return (_session.Id !== session.Id)
        })
        // this.cancelPendingById(+session.Id)
        this.timetable.push(session)
        this.data.setItem('-timeTable-', this.timetable).then(data => {
          this.data.getTimeTable().then(_data => {
            this.sync.sendDataToServer()
          })
        })
        // session['taken'] = "toNotTaken"
        // this.takenSessions.push(session)
        // console.log(this.takenSessions);
        // this.timetable = this.timetable.filter(_session => {
        //   return (_session.Id !== session.Id)
        // })

        // this.timetable.push(session)
        // this.data.setItem('-timeTable-', this.timetable)

      }
    })
    this.filterById(sessionId)
  }

  getPendings() {
    LocalNotifications.getPending().then(result => {
      // console.log(result);
      this.pendings = result
    })
  }
  // getPendingsAndFilterTimetable() {
  //   LocalNotifications.getPending().then(result => {
  //     console.log(result);
  //     this.pendings = result
  //     if (this.pendings.length > 0) {


  //       this.pendings.notification.forEach(_notification => {
  //         this.timetable.MyTimetable = this.timetable.MyTimetable.filter(_item => {
  //           return (_notification.id !== _item.Id)
  //         });
  //       });
  //       this.setNotifications()
  //     } else {
  //       this.setNotifications()

  //     }
  //   })
  // }

  markNotification(id) {
    try {
      this.timetable.forEach(item => {
        if (item.Id == id) {
          this.presentAlertConfirm(item)
        }

      });
    } catch (error) {
      // console.log(error);

    }

  }

  cancelNotification(id) {
    // console.log('cancel notification', id);

    LocalNotifications.cancel({
      notifications: [{
        id: id,
      }]
    });
  }

  // setTimeTableManually() {
  //   this.data.setItem('-timeTable-', SampleJson)
  // }

  cancelPendingById(id) {
    this.pendings.notifications.forEach(_notification => {
      if (_notification.id == id) {
        this.cancelNotification(id)
      }
    });
  }

  myGoBack() {
    this.router.navigate(['landing'])
  }
  manualNotify() {
    let attachment = {
      id:'1',
      url:'https://inet-tmsolutions.com/medhelpmovie/med_2.mp4'
    } 
    LocalNotifications.schedule({
      notifications: [
        {
          title: "Itemname",
          body: "Please have",
          attachments: [attachment],
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
  fitlerManually(notification) {
    try {
      // console.log('ppppppppppppp');

      // this.data.getFiredNotification().then(notification => {
      if (notification) {
        // console.log('notification fired', notification);

        // let __resTime = notification.notification.schedule.at.getDate()
        // console.log(__resTime);


        let _dateStringToFilter = notification.notification.body
        let _dateSubToFilter = _dateStringToFilter.substring(0, 10);

        this.filterByDate(_dateSubToFilter,"")
      }
      // })
    } catch (error) {
      // console.log(error);
    }
  }
  filterById(notificationClicked){
    // console.log('filter by id ',notificationClicked);
    this.filteredTable = []
    // this.filteredTable =  this.filteredTable.filter(session =>{
    //   return(session.Id == notificationClicked)
    // })
    this.timetable.forEach(item => {
      if (item.Id == notificationClicked) {
        this.filteredTable.push(item)
      }
    })
  }


  goBack(){
    this.router.navigate(['landing'])
  }

  async getTimeTablefromLocal() {
    let data: any;
    await this.localStorage.getItem('-timeTable-').subscribe((val) => {
      // console.log(val);
      this.timetable = val
      return val
    });
  }

  async getUser() {
    let data: any;
    await this.localStorage.getItem('-user-').subscribe((val) => {
      // console.log(val);
      this.user = val
      return val
    });
  }

}