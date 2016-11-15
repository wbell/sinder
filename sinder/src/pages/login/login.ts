import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Auth } from '../../providers/auth';

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController, public auth: Auth) {}

  ionViewDidLoad() {
    console.log('Hello LoginPage Page');
  }

  slides = [
    {
      title: "Find the right folks.",
      description: "So many skillz in the EC, but who do I talk to about XYZ?",
      image: "http://images.clipartpanda.com/confusion-clipart-Royalty-free-confused-clipart-illustration-215196.png",
    },
    {
      title: "Break dat ice.",
      description: "100% of internet users are socially awkward. Use Sinder as an excuse to strike up a convo with a stranger!",
      image: "https://s-media-cache-ak0.pinimg.com/736x/cd/94/cb/cd94cbace4684840caf3144cdb01dd91.jpg",
    },
    {
      title: "Expand yo network.",
      description: "Be happy time business work friends forever cuz you met on Sinder!",
      image: "https://s-media-cache-ak0.pinimg.com/564x/31/bd/3a/31bd3a43d5cac4bd5e0c4e3d802dfe91.jpg",
    }
  ];

  login() {
    console.log('call login service', this.auth);
    this.auth.authenticate();
  }

}
