import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController, AlertController, ToastController } from 'ionic-angular';
import { Auth } from '../../providers/auth';
import { Firebase } from '../../providers/firebase';
import SillyName from 'sillyname';

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

  constructor(
    public navCtrl: NavController,
    public auth: Auth,
    public firebase: Firebase,
    public fb: FormBuilder,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController
  ) {

    this.authObj = auth.getUser();

    // build the form
    this.buildForm();
  }

  buildForm(){

    // instantiate blank
    this.profile = this.fb.group({
      photoURL: null,
      displayName: null,
      nickName: null,
      email: null
    });

    // get profile
    this.auth.profileChecks(this.authObj).then(profile=>{

      this.profile = this.fb.group({
        photoURL: [profile.photoURL, profile.employee ? Validators.required : null],
        displayName: [{value: profile.displayName, disabled: true}, Validators.required],
        email: [{value: profile.email, disabled: true}, Validators.required],
        nickName: profile.nickName
      });

      console.log('controls', this.profile.controls);

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
      duration: 2000,
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
      email: this.authObj.email
    };

    this.firebase.update(defaults, 'users', this.authObj.uid).then(res=>{
      console.log('update success', res);
      this.buildForm();
      this.showToast('bottom', 'Google information restored successfully');
    });
  }

  ionViewDidLoad() {
    console.log('Hello SettingsPage Page');
  }

}
