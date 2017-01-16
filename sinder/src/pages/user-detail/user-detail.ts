import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Firebase } from '../../providers/firebase';

/*
  Generated class for the UserDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-user-detail',
  templateUrl: 'user-detail.html'
})
export class UserDetailPage {

  u: any = {};
  tags: any = {};
  staffLevels: any = {};

  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    public firebase: Firebase,
    public viewCtrl: ViewController
  ) {
    this.u = this.params.get('user');
    this.getContent();
  }

  getContent(){
    let paths = ['tags', 'staff-levels'];

    this.firebase.getPaths(paths).then(res=>{
      // console.log('got paths', res);
      this.tags = res[0];
      this.staffLevels = res[1];
    });
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    console.log('Hello UserDetailPage Page');
  }

}
