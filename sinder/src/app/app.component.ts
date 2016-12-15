import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ModalController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { LoginPage } from '../pages/login/login';
import { SettingsPage } from '../pages/settings/settings';
import { AboutPage } from '../pages/about/about';
import { TeamsPage } from '../pages/teams/teams';

import { Firebase } from '../providers/firebase';
import { Auth } from '../providers/auth';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  loggedIn: boolean;

  rootPage: any = LoginPage;

  pages: Array<{title: string, component?: any, action?: Function, visible?: Function}>;

  constructor(public platform: Platform, public firebase: Firebase, public auth: Auth, public modalCtrl: ModalController) {
    console.log('App Constructor');

    this.initializeApp();
    this.attachAuthListener();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Login', component: LoginPage, visible: ()=>{ return !this.loggedIn} },
      { title: 'Teams', component: TeamsPage, visible: ()=>{ return this.loggedIn} },
      { title: 'Settings', component: SettingsPage, visible: ()=>{ return this.loggedIn} },
      { title: 'About', action: (page)=>{
        let modal = this.modalCtrl.create(AboutPage);
        modal.present();
      }},
      { title: 'Log Out', action: (page) =>{
        this.auth.signOut();
      }, visible: ()=>{ return this.loggedIn}}
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
        this.nav.setRoot(TeamsPage);
        this.loggedIn = true;
      } else {
        this.nav.setRoot(LoginPage);
        this.loggedIn = false;
      }
    });
  }
}
