import { Injectable } from '@angular/core';
import { OneSignal, OSNotification, OSNotificationOpenedResult } from '@ionic-native/onesignal/ngx';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  constructor(
    private oneSignal: OneSignal
  ) { }

  initConfig() {

    this.oneSignal.startInit('dffcf3c5-f8b7-43b4-b185-6cfa4c7e3a22', '297117664594');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

    this
      .oneSignal
      .handleNotificationReceived()
      .subscribe((notification: OSNotification) => console.log('Notification received: ', notification));

    this
      .oneSignal
      .handleNotificationOpened()
      .subscribe((notification: OSNotificationOpenedResult) => console.log('Notification opened: ', notification));

    this.oneSignal.endInit();

  }

}
