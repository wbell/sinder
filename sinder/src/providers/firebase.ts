import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import firebase from 'firebase';
import config from '../app/firebase.config.json';

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
    this.db().initializeApp(config);
    console.log('firebase initialized');
  }

  db(){
    return firebase;
  }

  getRef(path, id?){
    const rootRef = this.db().database().ref();
    let ref = rootRef.child(path);

    if(id) ref = ref.child(id);

    return ref;
  }

  get(path, id?, options?){
    const ref = this.getRef(path, id);

    if(!options){
      return ref.once('value').then(data => {
        let val = data.val();
        // if(val && (val.id || id)) val.id = val.id || id;
        return val;
      });
    }
  }

  getArray(path, ids, options?){
    let promises = [];
    ids.forEach(id=>{
      promises.push(this.get(path, id).then(val =>{
        val.id = val.id || id;
        return val;
      }));
    });

    return Promise.all(promises);
  }

  set(params, path, id?){
    const ref = this.getRef(path, id);

    return ref.set(params);
  }

  update(params, path, id?){
    const ref = this.getRef(path, id);

    return ref.update(params);
  }

  remove(path, id?){
    const ref = this.getRef(path, id);

    return ref.remove();
  }

}
