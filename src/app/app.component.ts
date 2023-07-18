import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './services/data.service';
import { ActionPerformed, CancelOptions, LocalNotifications, LocalNotificationSchema } from '@capacitor/local-notifications'
import { Platform } from '@ionic/angular';
import { SyncService } from './services/sync.service';
// import WonderPush from 'wonderpush-cordova-sdk';
 

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(public sync: SyncService, public router: Router, private data: DataService, private platform: Platform,
  ) {
    LocalNotifications.requestPermissions();

    this.initializeApp()

  }

  initializeApp() {
    this.platform.ready().then(async () => {
      LocalNotifications.addListener('localNotificationActionPerformed', (notification: ActionPerformed) => {
        this.data.getTimeTable()
        this.data.getUser()
        this.data.setItem('-firedNotification-', notification)

        let idClicked = notification.notification.id
        let idToCancel = idClicked + '0000'
        this.cancelNotification(+idToCancel)
        // this.cancelNotification(this.firedNotificaionId)
        // this.cancelManualNotification()
        if (idClicked <49) {
          this.router.navigate(['video', { 'notification_id': notification.notification.id ,'notification_actionId': notification.actionId}])
        } else if(idClicked > 49 && idClicked <99){
          this.router.navigate(['video-two', { 'notification_id': notification.notification.id ,'notification_actionId': notification.actionId}])
        }
        
        if (idClicked > 100 && idClicked < 200) {
          this.router.navigate(['response', { 'timeSlot': "M"}])
          // if (notification.actionId =='yes') {
            //   this.sync.updateDailyTransaction("M",'1' )
            // } else if (notification.actionId =='no') {
              //   this.sync.updateDailyTransaction("M",'2' )
              // }
            } else  if (idClicked > 200 && idClicked < 300) {
          this.router.navigate(['response', { 'timeSlot': "E"}])
          // if (notification.actionId =='yes') {
          //   this.sync.updateDailyTransaction("E",'1' )
          // } else if (notification.actionId =='no') {
          //   this.sync.updateDailyTransaction("E",'2' )
          // }
        } 
        // if (idClicked == 2) {
        //   const cancelTodayNotification = async () => {
        //     const { notifications } = await LocalNotifications.getPending();
          
        //     const today = new Date();
        //     const todayYear = today.getFullYear();
        //     const todayMonth = today.getMonth() + 1; // Note: month is zero-indexed
        //     const todayDate = today.getDate();
          
        //     const notificationIdsToCancel = [3, 4, 5]; // IDs of notifications to cancel
          
        //     // Iterate over notification IDs
        //     notificationIdsToCancel.forEach(async (id) => {
        //       // Find notification with the specified ID and scheduled for today
        //       const notification = notifications.find(
        //         (n) =>
        //           n.id === id &&
        //           n.schedule?.on?.year === todayYear &&
        //           n.schedule?.on?.month === todayMonth &&
        //           n.schedule?.on?.day === todayDate
        //       );
          
        //       // If notification exists, cancel it
        //       if (notification) {
        //         await LocalNotifications.cancel({ notifications: [{ id }] });
        //       }
        //     });
        //   };
          
        //   cancelTodayNotification();
          
        // } else if (idClicked == 3) {
        //   const cancelTodayNotification = async () => {
        //     const { notifications } = await LocalNotifications.getPending();
          
        //     const today = new Date();
        //     const todayYear = today.getFullYear();
        //     const todayMonth = today.getMonth() + 1; // Note: month is zero-indexed
        //     const todayDate = today.getDate();
          
        //     const notificationIdsToCancel = [4, 5]; // IDs of notifications to cancel
          
        //     // Iterate over notification IDs
        //     notificationIdsToCancel.forEach(async (id) => {
        //       // Find notification with the specified ID and scheduled for today
        //       const notification = notifications.find(
        //         (n) =>
        //           n.id === id &&
        //           n.schedule?.on?.year === todayYear &&
        //           n.schedule?.on?.month === todayMonth &&
        //           n.schedule?.on?.day === todayDate
        //       );
          
        //       // If notification exists, cancel it
        //       if (notification) {
        //         await LocalNotifications.cancel({ notifications: [{ id }] });
        //       }
        //     });
        //   };
          
        //   cancelTodayNotification();
          
        // } else if (idClicked == 4) {
        //   const cancelTodayNotification = async () => {
        //     const { notifications } = await LocalNotifications.getPending();
          
        //     const today = new Date();
        //     const todayYear = today.getFullYear();
        //     const todayMonth = today.getMonth() + 1; // Note: month is zero-indexed
        //     const todayDate = today.getDate();
          
        //     const notificationIdsToCancel = [5]; // IDs of notifications to cancel
          
        //     // Iterate over notification IDs
        //     notificationIdsToCancel.forEach(async (id) => {
        //       // Find notification with the specified ID and scheduled for today
        //       const notification = notifications.find(
        //         (n) =>
        //           n.id === id &&
        //           n.schedule?.on?.year === todayYear &&
        //           n.schedule?.on?.month === todayMonth &&
        //           n.schedule?.on?.day === todayDate
        //       );
          
        //       // If notification exists, cancel it
        //       if (notification) {
        //         await LocalNotifications.cancel({ notifications: [{ id }] });
        //       }
        //     });
        //   };
          
        //   cancelTodayNotification();
          
        // } else if (idClicked == 7) {
        //   const cancelTodayNotification = async () => {
        //     const { notifications } = await LocalNotifications.getPending();
          
        //     const today = new Date();
        //     const todayYear = today.getFullYear();
        //     const todayMonth = today.getMonth() + 1; // Note: month is zero-indexed
        //     const todayDate = today.getDate();
          
        //     const notificationIdsToCancel = [8, 9, 10]; // IDs of notifications to cancel
          
        //     // Iterate over notification IDs
        //     notificationIdsToCancel.forEach(async (id) => {
        //       // Find notification with the specified ID and scheduled for today
        //       const notification = notifications.find(
        //         (n) =>
        //           n.id === id &&
        //           n.schedule?.on?.year === todayYear &&
        //           n.schedule?.on?.month === todayMonth &&
        //           n.schedule?.on?.day === todayDate
        //       );
          
        //       // If notification exists, cancel it
        //       if (notification) {
        //         await LocalNotifications.cancel({ notifications: [{ id }] });
        //       }
        //     });
        //   };
          
        //   cancelTodayNotification();
          
        // } else if (idClicked == 8) {
        //   const cancelTodayNotification = async () => {
        //     const { notifications } = await LocalNotifications.getPending();
          
        //     const today = new Date();
        //     const todayYear = today.getFullYear();
        //     const todayMonth = today.getMonth() + 1; // Note: month is zero-indexed
        //     const todayDate = today.getDate();
          
        //     const notificationIdsToCancel = [ 9, 10]; // IDs of notifications to cancel
          
        //     // Iterate over notification IDs
        //     notificationIdsToCancel.forEach(async (id) => {
        //       // Find notification with the specified ID and scheduled for today
        //       const notification = notifications.find(
        //         (n) =>
        //           n.id === id &&
        //           n.schedule?.on?.year === todayYear &&
        //           n.schedule?.on?.month === todayMonth &&
        //           n.schedule?.on?.day === todayDate
        //       );
          
        //       // If notification exists, cancel it
        //       if (notification) {
        //         await LocalNotifications.cancel({ notifications: [{ id }] });
        //       }
        //     });
        //   };
          
        //   cancelTodayNotification();
          
        // } else if (idClicked == 9) {
        //   const cancelTodayNotification = async () => {
        //     const { notifications } = await LocalNotifications.getPending();
          
        //     const today = new Date();
        //     const todayYear = today.getFullYear();
        //     const todayMonth = today.getMonth() + 1; // Note: month is zero-indexed
        //     const todayDate = today.getDate();
          
        //     const notificationIdsToCancel = [10]; // IDs of notifications to cancel
          
        //     // Iterate over notification IDs
        //     notificationIdsToCancel.forEach(async (id) => {
        //       // Find notification with the specified ID and scheduled for today
        //       const notification = notifications.find(
        //         (n) =>
        //           n.id === id &&
        //           n.schedule?.on?.year === todayYear &&
        //           n.schedule?.on?.month === todayMonth &&
        //           n.schedule?.on?.day === todayDate
        //       );
          
        //       // If notification exists, cancel it
        //       if (notification) {
        //         await LocalNotifications.cancel({ notifications: [{ id }] });
        //       }
        //     });
        //   };
          
        //   cancelTodayNotification();
          
        // }

      })
      // WonderPush.subscribeToNotifications();
    });

    LocalNotifications.createChannel({
      id: 'manualAlerts',
      name: 'Manual Alerts',
      importance: 5,
      description: 'My namual alert',
      sound: 'organfinale.wav',
      visibility: 1,
      vibration: true,
      });

  }
  cancelNotification(id) {
    // console.log('cancel notification', id);

    LocalNotifications.cancel({
      notifications: [{
        id: id,
      }]
    });
  }
}
