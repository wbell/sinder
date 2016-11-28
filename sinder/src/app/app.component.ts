import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { LoginPage } from '../pages/login/login';
import { SettingsPage } from '../pages/settings/settings';

import { Firebase } from '../providers/firebase';
import { Auth } from '../providers/auth';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, component?: any, action?: Function}>;

  constructor(public platform: Platform, public firebase: Firebase, public auth: Auth) {
    console.log('App Constructor');

    this.initializeApp();
    this.attachAuthListener();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Login', component: LoginPage },
      { title: 'Settings', component: SettingsPage },
      { title: 'Page One', component: Page1 },
      { title: 'Page Two', component: Page2 },
      { title: 'Log Out', action: (page) =>{
        this.auth.signOut();
      }}
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // if page has an action, do the action instead of navigating anywhere
    if(page.action){
      page.action(page);
      return false;
    }

    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  attachAuthListener(){
    this.firebase.db().auth().onAuthStateChanged(user => {
      console.log('auth state changed from app component', user);

      if (user) {
        // User is signed in.
        this.nav.setRoot(Page1);
      } else {
        this.nav.setRoot(LoginPage);
      }
    });
  }
}
