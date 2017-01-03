import { Component } from '@angular/core';
import { NavController, ItemSliding, AlertController, ToastController } from 'ionic-angular';
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

  tags: any;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public auth: Auth,
    public firebase: Firebase
  ) {
    this.authObj = auth.getUser();

  }

  getTags(){
    return this.firebase.get('tags').then(tags => {
      // console.log('got tags', tags);
      this.tags = tags;
    });
  }

  getTeams(uid){
    this.firebase.get('teams').then(teamObj => {

      console.log('teamObj', teamObj);

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

  addTeam(teamId, event?, slidingItem?: ItemSliding){
    if(event) event.stopPropagation();
    if(slidingItem) slidingItem.close();
    this.navCtrl.push(TeamBuilderPage, {teamId: teamId});
  }

  deleteTeam(team){
    console.log('Actually delete this team', team);
    this.firebase.update({inactive: true}, 'teams', team.id).then(res =>{
      console.log('team successfully deleted', res);
      this.ionViewDidEnter();
      this.presentToast('"'+team.name+'" was successfully deleted.');
    });
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }

  presentConfirm(team, event?) {
    if(event) event.stopPropagation();

    let alert = this.alertCtrl.create({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete "'+team.name+'"?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteTeam(team);
          }
        }
      ]
    });
    alert.present();
  }

  goToChat(team, slidingItem?: ItemSliding){

    if(slidingItem) slidingItem.close();

    if(team.members.length){
      console.log('Chat for team #', team.id);
    } else {
      console.warn('Must have team members before chat is available');
      if(team.isOwner) this.addTeam(team.id);
    }
  }

  ionViewDidLoad() {
    console.log('Hello TeamsPage Page');
  }

  ionViewDidEnter(){
    this.getTags().then(()=>{
      this.getTeams(this.authObj.uid);
    });
  }

}
