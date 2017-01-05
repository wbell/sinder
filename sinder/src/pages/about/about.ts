import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import pkg from '../../../../package.json';

console.log('pkg', pkg);
/*
  Generated class for the About page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  pkg: any = pkg;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController) {}

  ionViewDidLoad() {
    console.log('Hello AboutPage Page');
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

}
