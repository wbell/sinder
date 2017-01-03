import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Auth } from '../../providers/auth';
import { Firebase } from '../../providers/firebase';

/*
  Generated class for the TeamBuilder page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-team-builder',
  templateUrl: 'team-builder.html'
})
export class TeamBuilderPage {

  team: FormGroup;

  authObj: any;

  tags: Array<string>;

  constructor(
    public params: NavParams,
    public navCtrl: NavController,
    public auth: Auth,
    public firebase: Firebase,
    public fb: FormBuilder
  ) {

    this.authObj = auth.getUser();

    this.getTags();
    this.buildForm();
  }

  getTags(){
    this.firebase.get('tags').then(tags => {
      // console.log('got tags', tags);
      this.tags = tags;
    });
  }

  buildForm(){

    // instantiate blank
    this.team = this.fb.group({
      name: ['', Validators.required],
      ownerName: [null, Validators.required],
      owner: [null, Validators.required],
      tags: [[]],
      members: [[]]
    });

    // get team deets
    const teamId = this.params.get('teamId');

    if(teamId){
      this.populateWithTeamInfo(teamId);
    } else {
      this.populateWithProfileInfo();
    }

  }

  populateWithTeamInfo(teamId){
    console.log('populateWithTeamInfo', teamId);
    this.firebase.get('teams', teamId).then(team => {
      const promises = [
        team,
        this.firebase.get('users', team.owner),
        this.firebase.getArray('users', team.members || [])
      ];

      return Promise.all(promises);
    }).then(resolves => {
      const team = resolves[0];
      const owner = resolves[1];
      const members = resolves[2];

      this.team = this.fb.group({
        name: [team.name, Validators.required],
        ownerName: [{value: owner.displayName, disabled: true}],
        owner: [{value: team.owner}, Validators.required],
        tags: [team.tags],
        members: [members]
      });

    });
  }

  populateWithProfileInfo(){

    this.firebase.get('users', this.authObj.uid).then(profile => {

      this.team = this.fb.group({
        name: ['', Validators.required],
        ownerName: [{value: profile.displayName, disabled: true}],
        owner: [this.authObj.uid, Validators.required],
        tags: [[]],
        members: [[]]
      });

      console.log('team', this.team);

    });
  }

  submitForm(formValue){
    console.log('team form value', formValue);

    let teamId = this.params.get('teamId');

    if(!teamId){
      let teamRef = this.firebase.getRef('teams').push();

      console.log('teamRef', teamRef);

      teamId = teamRef.key;
    }

    this.firebase.set(formValue, 'teams', teamId).then(res =>{
      console.log('team created/updated successfully', res);

      this.launchMemberFinder(teamId);
    });

  }

  launchMemberFinder(teamId){
    console.log('go to member finder page for team:', teamId);
  }

  ionViewDidLoad() {
    console.log('Hello TeamBuilderPage Page');
  }

}
