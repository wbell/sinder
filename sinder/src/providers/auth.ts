import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Firebase } from './firebase';
import 'rxjs/add/operator/map';

/*
  Generated class for the Auth provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Auth {

  db: any = null;

  authObj: any = null;

  user: any = null;

  employeeDomain: string = 'pwc.com';

  constructor(public http: Http, public firebase: Firebase) {
    console.log('Hello Auth Provider');
    this.db = firebase.db();
    this.attachAuthListener();
  }

  authenticate(){
    const provider = new this.db.auth.GoogleAuthProvider();

    return this.db.auth().signInWithPopup(provider).then(result => {
      console.info('authenticate success', result);
      return result;
    }, err => {
      console.error('authenticate error', err);
    });
  }

  signOut(){

    return this.db.auth().signOut().then(()=>{
      console.info('signOut success');
      return true;
    }, err => {
      console.error('signOut error', err);
    });
  }

  attachAuthListener(){
    this.db.auth().onAuthStateChanged(fbauth=>{
      this.authObj = fbauth;

      if(fbauth) this.profileChecks(fbauth);
    });
  }

  profileChecks(authObj){
    return this.firebase.get('users', authObj.uid).then(profile => {
      if(!profile) {
        return this.createUser(authObj);
      } else {
        return profile;
      }
    });
  }

  getUser(){
    return this.authObj;
  }

  createUser(authObject){
    let profile: any = {};

    profile.displayName = authObject.displayName;
    profile.email = authObject.email;
    profile.photoURL = authObject.photoURL;
    profile.employee = this.employeeCheck(authObject.email);

    return this.firebase.set(profile, 'users', authObject.uid).then(res => {
      console.log('User profile successfully created', profile, res);
      return profile;
    });
  }

  employeeCheck(email){
    return email.slice(-this.employeeDomain.length) === this.employeeDomain;
  }

}
