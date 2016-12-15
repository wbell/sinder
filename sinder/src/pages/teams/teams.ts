import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Auth } from '../../providers/auth';
import { Firebase } from '../../providers/firebase';

/*
  Generated class for the Teams page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-teams',
  templateUrl: 'teams.html'
})
export class TeamsPage {

  authObj: any;

  teamsList: Array<any> = [];

  constructor(
    public navCtrl: NavController,
    public auth: Auth,
    public firebase: Firebase,
  ) {
    this.authObj = auth.getUser();
    this.getTeams(this.authObj.uid);
  }

  getTeams(uid){
    this.firebase.get('users', uid).then(profile => {
      const teamIds = profile.teams || [];
      return teamIds;
    }).then(teamIds => {
      return this.firebase.getArray(teamIds, 'teams');
    }).then(teamsList=>{
      this.teamsList = teamsList;
    });
  }

  addTeam(){
    // this.navCtrl.push(TeamBuilderPage);
  }

  ionViewDidLoad() {
    console.log('Hello TeamsPage Page');
  }

}
