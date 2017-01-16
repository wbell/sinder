import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController, Content, ModalController } from 'ionic-angular';
import { Firebase } from '../../providers/firebase';
import { Auth } from '../../providers/auth';
import { UserDetailPage } from '../user-detail/user-detail';
import { TeamBuilderPage } from '../team-builder/team-builder';
import _omit from 'lodash/omit';

/*
  Generated class for the TeamChat page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-team-chat',
  templateUrl: 'team-chat.html'
})
export class TeamChatPage {
  @ViewChild(Content) content1: Content;

  authObj: any;

  user: any = {admin: false};

  team: any = {
    members: []
  };

  chat: any;

  message: string = '';

  chatRef: firebase.database.Reference;

  chatters: any;

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public params: NavParams,
    public firebase: Firebase,
    public auth: Auth
  ) {
    this.authObj = auth.getUser();
    this.team = params.get('team');
    this.chatRef = firebase.getRef('chats', this.team.id);
    this.getUser(this.authObj.uid);
  }

  getChat(){
    let team = this.team;
    let teamChat = null;

    this.firebase.get('chats', team.id).then(chat=>{
      console.log('this.chatRef', this.chatRef);
      console.log('chat', chat);

      teamChat = chat || {};

      return teamChat;
    }).then(chat=>{
      let chatters = [];
      for(let m in chat){
        if(chatters.indexOf(chat[m].by)===-1){
          chatters.push(chat[m].by);
        }
      }

      return this.firebase.getArray('users', chatters);
    }).then(chatters=>{
      let chatterObj = {};

      chatters.forEach(chatter=>{
        chatterObj[chatter.id] = chatter;
      });

      this.chatters = chatterObj;
      this.chat = teamChat;

      console.log('this.chatters', this.chatters);
      console.log('this.chat', this.chat);

      this.attachRefListeners();
    });

  }

  sendMessage(message){
    let msg = {
      by: this.authObj.uid,
      message: message,
      timestamp: Date.now()
    };

    console.log('msg posted', msg);

    this.chatRef.push(msg).then(res=>{
      console.log('message posted successfully', res);
      this.message = '';
      this.scrollToBottom();
    })
    .catch(err=>{
      this.presentToast(err.message);
    });
  }

  attachRefListeners(){
    this.chatRef.on('child_added', (childSnapshot, prevChildKey)=>{
      console.log('CHILD ADDED', childSnapshot, prevChildKey);
      let key = childSnapshot.key;
      let val = childSnapshot.val();

      this.addToChatters(val.by).then(res=>{
        let mergeObj = {};
        mergeObj[key] = val;
        this.chat = Object.assign({}, this.chat, mergeObj);
        this.scrollToBottom();
      });

    });

    this.chatRef.on('child_removed', oldSnapshot=>{
      console.log('CHILD REMOVED', oldSnapshot);
      let key = oldSnapshot.key;

      this.chat = _omit(this.chat, key);
    });
  }

  addToChatters(userId){
    if(this.chatters[userId]){
      return Promise.resolve(true);
    } else {
      return this.firebase.get('users', userId).then(user=>{
        this.chatters[userId] = user;
        return user;
      });
    }
  }

  deleteMessage(messageId){
    let ref = this.chatRef.child(messageId);

    ref.remove().then(()=>{
      console.log(messageId+' removed');
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

  getUser(uid){
    this.firebase.get('users', uid).then(user=>{
      this.user = user;
      console.log('this.user', this.user);
    });
  }

  scrollToBottom(duration?: number){
    this.content1.scrollToBottom(duration);
  }

  userDetail(user){
    let userModal = this.modalCtrl.create(UserDetailPage, { user: user });

    userModal.present();
  }

  teamDetails(teamId){
    this.navCtrl.push(TeamBuilderPage, {teamId: teamId});
  }

  ionViewDidLoad() {
    console.log('Hello TeamChatPage Page');
  }

  ionViewDidEnter(){
    this.getChat();
  }

  ionViewWillLeave(){
    this.chatRef.off();
  }

}
