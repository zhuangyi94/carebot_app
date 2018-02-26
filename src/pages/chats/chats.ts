import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController } from 'ionic-angular';
import { RequestsProvider } from '../../providers/requests/requests';
import { ChatProvider } from '../../providers/chat/chat';
import { SpinnerDialog } from '@ionic-native/spinner-dialog'
/**
 * Generated class for the ChatsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})
export class ChatsPage {
  myrequests;
  myfriends;
  myGuardian = [];
  myElderly = [];
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public requestservice: RequestsProvider,
    public events: Events, 
    public alertCtrl: AlertController,
    public chatservice: ChatProvider,
    public spinner: SpinnerDialog) {
  }


  ionViewWillEnter() {
    
    this.requestservice.getmyrequests();
    this.requestservice.getmyfriends();
    this.requestservice.getmyGuardian();
    this.requestservice.getmyElderly();

    //this.spinner.show();

    let promise = new Promise( resolve=> {
      this.myfriends = [];
      this.events.subscribe('gotrequests', () => {
        this.myrequests = [];
        this.myrequests = this.requestservice.userdetails;
      })
      this.events.subscribe('friends', () => {
        this.myfriends = [];
        this.myfriends = this.requestservice.myfriends; 
      })
       this.events.subscribe('guardian', () => {
        this.myGuardian = [];
        this.myGuardian = this.requestservice.myGuardian; 
      console.log("myGuardian",this.myGuardian)  
      })
       this.events.subscribe('elderly', () => {
        this.myElderly = [];
        this.myElderly = this.requestservice.myElderly; 
      console.log("myelderly",this.myElderly)  
      })

    }).then( res => {
      //this.spinner.hide();
    })


 
  }

  ionViewDidLeave() {
    this.events.unsubscribe('gotrequests');
    this.events.unsubscribe('friends');
  }


  addbuddy() {
    this.navCtrl.push('BuddiesPage');
  }

  buddychat(buddy) {
    this.chatservice.initializebuddy(buddy);
    this.navCtrl.push('BuddychatPage');
  }

  accept(item) {
    this.requestservice.acceptrequest(item).then(() => {
      
      let newalert = this.alertCtrl.create({
        title: 'Friend added',
        subTitle: 'Tap on the friend to chat with him',
        buttons: ['Okay']
      });
      newalert.present();
    })
  }

  ignore(item) {
    this.requestservice.deleterequest(item).then(() => {

    }).catch((err) => {
      alert(err);
    })
  }

}