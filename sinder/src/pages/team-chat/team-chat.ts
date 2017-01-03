import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the TeamChat page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-team-chat',
  templateUrl: 'team-chat.html'
})
export class TeamChatPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello TeamChatPage Page');
  }

}
