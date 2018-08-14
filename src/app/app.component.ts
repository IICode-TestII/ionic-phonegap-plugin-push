import { Component } from '@angular/core';
import { Platform, Nav, App, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

import { TabsPage } from '../pages/tabs/tabs';
import { AboutPage } from '../pages/about/about';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private appCtrl: App,
    private push: Push,
    private alertCtrl: AlertController
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.checkIfPermission();
    });
  }

  checkIfPermission() {
    this.push.hasPermission()
      .then((res: any) => {

        if (res.isEnabled) {
          alert("Has persmision")
          this.initPush();
        } else {
          alert("Has persmision")
        }

      });
  }

  initPush() {
    const options: PushOptions = {
      android: {},
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      },
      windows: {},
      browser: {
        pushServiceURL: 'http://push.api.phonegap.com/v1/push'
      }
    }
    const pushObject: PushObject = this.push.init(options);

    pushObject.on('registration').subscribe((registration: any) => console.log(registration));

    pushObject.on('notification').subscribe(
      (notification: any) => {
        pushObject.finish()
          .then(e => alert)
          .catch(e => { console.log("ERROR NOTIFICATION", e); })

        let confirmAlert = this.alertCtrl.create({
          title: "New notification",
          message: JSON.stringify(notification),
          buttons: [{
            text: 'Ignore',
            role: "cancel"
          }, {
            text: "view",
            handler: () => {
              this.appCtrl.getRootNav().setRoot(AboutPage);
            }
          }]
        });

        confirmAlert.present();
      },
      err => {
        alert("Error")
      }
    )

    pushObject.on('error').subscribe(error => console.error(error));
  }
}
