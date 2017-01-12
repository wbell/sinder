import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController, AlertController, ToastController } from 'ionic-angular';
import { Auth } from '../../providers/auth';
import { Firebase } from '../../providers/firebase';
import { ArrayMinLength } from '../../validators/array-length';
import SillyName from 'sillyname';
import faker from 'faker';
import _sample from 'lodash/sample';
import _keys from 'lodash/keys';

/*
  Generated class for the Settings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  profile: FormGroup;

  defaultPhoto: string = 'assets/img/photo.jpg';

  randomNickname: string = SillyName();

  authObj: any;

  tags: any;

  staffLevels: any;

  rawProfile: any = {admin: false};

  numEmployees: number = 1;

  numEmployeeOptions: Array<number> = [1, 5, 10, 20];

  employeeTags: Array<string>;

  constructor(
    public navCtrl: NavController,
    public auth: Auth,
    public firebase: Firebase,
    public fb: FormBuilder,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController
  ) {

    this.authObj = auth.getUser();

    // instantiate blank
    this.profile = this.fb.group({
      photoURL: null,
      displayName: null,
      nickName: null,
      email: null,
      tags: null,
      bio: null,
      staffLevel: null
    });

    this.buildForm();

    this.getTags();
    this.getStaffLevels();
  }

  getTags(){
    this.firebase.get('tags').then(tags => {
      console.log('got tags', tags);
      this.tags = tags;
    });
  }

  getStaffLevels(){
    this.firebase.get('staff-levels').then(levels => {
      console.log('got levels', levels);
      this.staffLevels = levels;
    });
  }

  buildForm(){

    // get profile
    this.firebase.get('users', this.authObj.uid).then(profile=>{

      this.rawProfile = profile;

      console.log('raw profile', profile);

      this.profile = this.fb.group({
        photoURL: [profile.photoURL, profile.employee ? Validators.required : null],
        staffLevel: [profile.staffLevel, profile.employee ? Validators.required : null],
        displayName: [{value: profile.displayName, disabled: true}, Validators.required],
        email: [{value: profile.email, disabled: true}, Validators.required],
        nickName: [profile.nickName, null],
        tags: [profile.tags || [], profile.employee ? ArrayMinLength(1) : null],
        bio: [profile.bio, null]
      });

      console.log('controls', this.profile.controls);

    }).catch(err=>{
      console.log('profile fetch err', err);
    });
  }

  submitForm(formValue){
    console.log('formValue', formValue);
    this.firebase.update(formValue, 'users', this.authObj.uid).then(()=>{
      // this.navCtrl.push();
      this.showToast('bottom', 'Profile saved successfully');
    });
  }

  showToast(position: string, message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: position
    });

    toast.present();
  }

  confirmReset(){
    let confirm = this.alertCtrl.create({
      title: 'Restore Google profile information?',
      message: 'Are you sure you\'d like to reset your profile with the information from your Google account?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'DO IT!',
          handler: () => {
            this.resetDefaults();
          }
        }
      ]
    });
    confirm.present();
  }

  resetDefaults(){

    let defaults = {
      photoURL: this.authObj.photoURL,
      nickName: '',
      displayName: this.authObj.displayName,
      email: this.authObj.email,
      tags: [],
      bio: '',
      staffLevel: null
    };

    this.firebase.update(defaults, 'users', this.authObj.uid).then(res=>{
      console.log('update success', res);
      this.buildForm();
      this.showToast('bottom', 'Google information restored successfully');
    });
  }

  employeeConfirm(){
    let confirm = this.alertCtrl.create({
      title: 'Creating Employee Records',
      message: 'Are you sure you want to create '+this.numEmployees+' employee records?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'DO IT!',
          handler: () => {
            this.createEmployees();
          }
        }
      ]
    });
    confirm.present();
  }

  confirmEmployeeClear(){
    let confirm = this.alertCtrl.create({
      title: 'Clearing Employee Records',
      message: 'Are you sure you want to clear all generated employee records?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'DO IT!',
          handler: () => {
            this.clearGeneratedEmployees();
          }
        }
      ]
    });
    confirm.present();
  }

  createEmployees(){
    let employeePromises = [];

    for(let i=0; i<this.numEmployees; i++){
      let profile = faker.helpers.userCard();
      let level = _sample(_keys(this.staffLevels));
      let employee = {
        displayName: profile.name,
        nickName: SillyName(),
        employee: true,
        generated: true,
        staffLevel: level,
        email: profile.email,
        photoURL: faker.image.avatar(),
        bio: profile.company.catchPhrase,
        tags: this.employeeTags
      };

      console.log('employee', employee);

      let ref = this.firebase.getRef('users').push(employee);

      employeePromises.push(ref);
    }

    Promise.all(employeePromises).then(res =>{
      console.log('employees created, show toast', res);
      this.showToast('bottom', res.length+' employee records successfully created');
    });
  }

  clearGeneratedEmployees(){
    const removalToast = ()=>{
      this.showToast('bottom', 'All generated employees successfully cleared');
    };

    let timer = setTimeout(removalToast, 1000);

    this.firebase.getRef('users').orderByKey().on('child_added', data =>{
      let val = data.val();

      console.log('orderby val', val);

      if(
        val.employee === true &&
        val.generated === true
      ) {
        this.firebase.remove('users', data.key);
        clearTimeout(timer);
        timer = setTimeout(removalToast, 1000);
      }
    });

  }

  logout(){
    this.auth.signOut();
  }

  ionViewDidLoad() {
    console.log('Hello SettingsPage Page');
  }

}
