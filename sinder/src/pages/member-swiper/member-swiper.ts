import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { StackConfig, ThrowEvent, SwingStackComponent, SwingCardComponent} from 'angular2-swing';
import { Firebase } from '../../providers/firebase';
import { UserDetailPage } from '../user-detail/user-detail';
import _sortBy from 'lodash/sortBy';
import _intersection from 'lodash/intersection';
import _shuffle from 'lodash/shuffle';

/*
  Generated class for the MemberSwiper page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-member-swiper',
  templateUrl: 'member-swiper.html'
})
export class MemberSwiperPage {

  @ViewChild('myswing1') swingStack: SwingStackComponent;
  @ViewChildren('mycards1') swingCards: QueryList<SwingCardComponent>;

  cards: Array<any> = [];

  stackConfig: StackConfig;

  tags: any;

  team: any;

  staffLevels: any;

  addedMembers: Array<any> = [];

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public firebase: Firebase,
    public params: NavParams
  ) {
    this.team = params.get('team');
    this.stackConfig = {
      throwOutConfidence: (offset, element)=>{
        return Math.min(Math.abs(offset) / (element.offsetWidth / 2), 1);
      }
    }; // configure later
    this.getMeta();
  }

  getMeta(){
    let metas = ['tags', 'staff-levels'];

    this.firebase.getPaths(metas).then(res => {
      this.tags = res[0];
      this.staffLevels = res[1];
    });

  }

  dismiss(){
    this.viewCtrl.dismiss(this.addedMembers);
  }

  getEmployeeCards(){
    let team = this.params.get('team');
    let currentMembers = (team.members.map(mem => mem.id) || []).concat([team.owner]);
    let unsorted = [];

    console.log('currentMembers', currentMembers, team);

    let sort = ()=>{
      this.sortCards(unsorted);
    };

    let timer = setTimeout(sort, 1000);

    this.firebase.getRef('users').orderByKey().on('child_added', data =>{
      let val = data.val();

      if(
        val.employee===true &&
        currentMembers.indexOf(data.key) === -1
      ) {
        val.id = data.key;
        unsorted.push(val);
        clearTimeout(timer);
        timer = setTimeout(sort, 1000);
      }
    });
  }

  sortCards(unsorted){
    // console.log('unsorted', unsorted);

    let chosenTags = this.params.get('team').tags || null;

    if(!chosenTags || !chosenTags.length){
      this.cards = _shuffle(unsorted);
    } else {

      let sorted = _sortBy(_shuffle(unsorted), [card =>{
        card.tags = card.tags || [];
        let matchingTags = _intersection(chosenTags, card.tags);
        return matchingTags.length;
      }, card=>{
        card.tags = card.tags || [];
        let matchingTags = _intersection(chosenTags, card.tags);
        return (matchingTags.length===card.tags.length) && matchingTags.length > 0;
      }]);

      this.cards = sorted;
    }

    // console.log('this.cards', this.cards);

    this.cardsLoaded();
  }

  cardsLoaded(){
    // console.log('Cards Loaded: this.cards', this.cards);
  }

  onThrowOut(event: ThrowEvent) {
    console.log('Hook from the template', event.throwDirection);
    let card = this.cards.pop();
    if(event.throwDirection===1){
      console.log('ADD ME TO MEMBERS event', card);
      this.addedMembers.push(card);
    } else {
      console.log('DISCARD', card);
    }
  }

  onTap(user){
    let userModal = this.modalCtrl.create(UserDetailPage, { user: user });

    userModal.present();
  }

  ionViewDidEnter(){

  }

  ionViewDidLoad() {
    console.log('Hello MemberSwiperPage Page');
    this.getEmployeeCards();
  }

  ionViewWillLeave(){
    this.firebase.getRef('users').off();
  }

}
