import { Injectable } from '@angular/core';
import { OneSignal, OSNotification, OSNotificationOpenedResult, OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { Subject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  private mensajes: OSNotificationPayload[] = [];

  public mensajesChanged = new Subject<void>();

  public userId: string;

  constructor(
    private oneSignal: OneSignal,
    private storage: Storage
  ) { }

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
      .pipe(
        map((notificationOpenedResult: OSNotificationOpenedResult) => notificationOpenedResult.notification)
      )
      .subscribe(async (notification: OSNotification) => {
        await this.loadMensajes();
        await this.receiveNotification(notification);
      });

    this.oneSignal.getIds().then(({ userId }) => this.userId = userId);

    this.oneSignal.endInit();

  }

  getMensajes() {
    return this.mensajes.slice();
  }

  receiveNotification = async (notification: OSNotification) => {

    await this.loadMensajes();

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

      await this.saveMensajes();

    }

  }

  async saveMensajes(): Promise<void> {
    await this.storage.set('mensajes', this.mensajes);
  }

  async loadMensajes(): Promise<void> {
    this.mensajes = await this.storage.get('mensajes') || [];
    this.mensajesChanged.next();
  }

}
