import { Injectable } from '@angular/core';
import { OneSignal, OSNotification, OSNotificationOpenedResult, OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { Subject } from 'rxjs';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  private mensajes: OSNotificationPayload[] = [];

  public mensajesChanged = new Subject<void>();

  constructor(
    private oneSignal: OneSignal,
    private storage: Storage
  ) {
    this.loadMensajes();
  }

  initConfig() {

    this.oneSignal.startInit('dffcf3c5-f8b7-43b4-b185-6cfa4c7e3a22', '297117664594');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

    this
      .oneSignal
      .handleNotificationReceived()
      .subscribe(this.receiveNotification);

    this
      .oneSignal
      .handleNotificationOpened()
      .subscribe((notification: OSNotificationOpenedResult) => console.log('Notification opened: ', notification));

    this.oneSignal.endInit();

  }

  getMensajes() {
    return this.mensajes.slice();
  }

  receiveNotification = (notification: OSNotification) => {

    const payload = notification.payload;

    const notificationExists =
      this
        .mensajes
        .findIndex(
          (currentNotification: OSNotificationPayload) => payload.notificationID === currentNotification.notificationID
        ) !== -1;

    if (!notificationExists) {

      this.mensajes.unshift(payload);
      this.mensajesChanged.next();

      this.saveMensajes();

    }

  }

  saveMensajes(): void {
    this.storage.set('mensajes', this.mensajes);
  }

  async loadMensajes(): Promise<void> {

    const mensajes = (await this.storage.get('mensajes') as OSNotificationPayload[]) || [];
    this.mensajes = mensajes;

    this.mensajesChanged.next();

  }

}
