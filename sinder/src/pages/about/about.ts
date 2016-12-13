import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';

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

  pkg: any = {
    "name": "sinder-ui",
    "version": "0.0.0",
    "description": "Looking for me? ;)",
    "main": "index.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    "repository": {
      "type": "git",
      "url": "git+https://github.com/wbell/sinder-ui.git"
    },
    "author": {
      "name": "Willie Bell",
      "email": "willie.bell@pwc.com"
    },
    "license": "UNLICENSED",
    "bugs": {
      "url": "https://github.com/wbell/sinder-ui/issues"
    },
    "homepage": "https://github.com/wbell/sinder-ui#readme"
  };

  constructor(public navCtrl: NavController, public viewCtrl: ViewController) {}

  ionViewDidLoad() {
    console.log('Hello AboutPage Page');
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

}
