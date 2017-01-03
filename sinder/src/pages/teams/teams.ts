import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Auth } from '../../providers/auth';
import { Firebase } from '../../providers/firebase';
import { TeamBuilderPage } from '../team-builder/team-builder';

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
    this.firebase.get('teams').then(teamObj => {
      let teamsList = [];
      for(let key in teamObj){
        let team = teamObj[key];
        if(
          (team.owner === uid ||
          (team.members && team.members.indexOf(uid) > -1)) &&
          !team.inactive
        ) {
          team.id = key;
          team.isOwner = team.owner === uid;
          team.members = team.members || [];
          team.tags = team.tags || [];
          teamsList.push(team);
        }
      }
      console.log('teamsList', teamsList);
      this.teamsList = teamsList;
    });
  }

  addTeam(teamId, event){
    if(event) event.stopPropagation();
    this.navCtrl.push(TeamBuilderPage, {teamId: teamId});
  }

  goToChat(teamId){
    console.log('Chat for team #', teamId);
  }

  ionViewDidLoad() {
    console.log('Hello TeamsPage Page');
  }

}
