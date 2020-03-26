import { Component, OnInit, OnDestroy, ApplicationRef } from '@angular/core';
import { PushService } from '../services/push.service';
import { Subscription } from 'rxjs';
import { OSNotificationPayload } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  public mensajes: OSNotificationPayload[] = [];

  private mensajesSub: Subscription;

  public userId: string;

  constructor(
    private pushService: PushService,
    private applicationRef: ApplicationRef
  ) {}

  async ngOnInit() {

    this.mensajesSub = this.pushService.mensajesChanged.subscribe(() => {
      this.mensajes = this.pushService.getMensajes();
      this.applicationRef.tick();
    });

    await this.pushService.loadMensajes();

  }

  ionViewDidEnter() {
    this.userId = this.pushService.userId;
  }

  ngOnDestroy() {
    this.mensajesSub.unsubscribe();
  }

}
