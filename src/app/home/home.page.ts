import { Component, OnInit, OnDestroy } from '@angular/core';
import { PushService } from '../services/push.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  public mensajes = this.pushService.getMensajes();

  private mensajesSub: Subscription;

  constructor(
    private pushService: PushService
  ) {}

  ngOnInit() {
    this.mensajesSub = this.pushService.mensajesChanged.subscribe(() => this.mensajes = this.pushService.getMensajes());
  }

  ngOnDestroy() {
    this.mensajesSub.unsubscribe();
  }

}
