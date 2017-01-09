import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { StackConfig, Stack, Card, ThrowEvent, DragEvent, SwingStackComponent, SwingCardComponent} from 'angular2-swing';
import { Firebase } from '../../providers/firebase';
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

  cards: Array<any>;

  stackConfig: StackConfig;

  tags: any;

  staffLevels: any;

  addedMembers: Array<any> = [];

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public firebase: Firebase,
    public params: NavParams
  ) {
    this.stackConfig = {}; // configure later
    this.getMeta();
  }

  getMeta(){
    let metas = [];

    metas.push(this.firebase.get('tags'));
    metas.push(this.firebase.get('staff-levels'));

    Promise.all(metas).then(res => {
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
    console.log('unsorted', unsorted);

    let chosenTags = this.params.get('team').tags || null;

    if(!chosenTags || !chosenTags.length){
      this.cards = _shuffle(unsorted);
    } else {

      let sorted = _sortBy(unsorted, [card =>{
        let matchingTags = _intersection(chosenTags, card.tags || []);
        return matchingTags.length;
      }]);

      this.cards = sorted;
    }

    console.log('this.cards', this.cards);

    this.cardsLoaded();
  }

  cardsLoaded(){
    // // ViewChild & ViewChildren are only available
    // // in this function
    //
    // console.log('swingStack', this.swingStack); // this is the stack
    // console.log('swingCards', this.swingCards); // this is a list of cards
    //
    // // we can get the underlying stack
    // // which has methods - createCard, destroyCard, getCard etc
    // console.log('swingStack.stack', this.swingStack.stack);
    //
    // // and the cards
    // // every card has methods - destroy, throwIn, throwOut etc
    // this.swingCards.forEach((c) => console.log('c.getCards', c.getCard()));
    //
    // // this is how you can manually hook up to the
    // // events instead of providing the event method in the template
    // this.swingStack.throwoutleft.subscribe((event: ThrowEvent) => console.log('Manual hook: ', event));
    //
    // this.swingStack.dragstart.subscribe((event: DragEvent) => console.log('dragstart', event));
    //
    // this.swingStack.dragmove.subscribe((event: DragEvent) => console.log('dragmove', event));
  }

  // This method is called by hooking up the event
  // on the HTML element - see the template above
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

  ionViewDidEnter(){
    this.getEmployeeCards();
  }

  ionViewDidLoad() {
    console.log('Hello MemberSwiperPage Page');
  }

}
