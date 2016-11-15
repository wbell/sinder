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

  firebase: any = null;

  constructor(public http: Http, public fb: Firebase) {
    console.log('Hello Auth Provider');
    this.firebase = fb.ref();
  }

  authenticate(){
    const provider = new this.firebase.auth.GoogleAuthProvider();

    return this.firebase.auth().signInWithPopup(provider).then(result => {
      console.info('authenticate success', result);
      return result;
    }, err => {
      console.error('authenticate error', err);
    });
  }

  signOut(){

    return this.firebase.auth().signOut().then(()=>{
      console.info('signOut success');
      return true;
    }, err => {
      console.error('signOut error', err);
    });
  }

}
