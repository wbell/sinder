import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import firebase from 'firebase';
import config from '../app/firebase.config';

/*
  Generated class for the Firebase provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Firebase {

  constructor(public http: Http) {
    console.log('Hello Firebase Provider');
    this.initFirebase();
  }

  initFirebase(){
    firebase.initializeApp(config);
    console.log('firebase initialized');
  }

  ref(){
    return firebase;
  }

}
