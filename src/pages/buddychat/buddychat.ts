import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Content, LoadingController, AlertController } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { ImghandlerProvider } from '../../providers/imghandler/imghandler';
import firebase from 'firebase';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { CallNumber } from '@ionic-native/call-number';
/**
 * Generated class for the BuddychatPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-buddychat',
  templateUrl: 'buddychat.html',
})
export class BuddychatPage {
  @ViewChild('content') content: Content;
  buddy: any;
  newmessage;
  allmessages = [];
  photoURL;
  imgornot;
  buddyName;
  phoneNumber;

  constructor(public navCtrl: NavController, public navParams: NavParams, public chatservice: ChatProvider,
    public events: Events, public zone: NgZone, public loadingCtrl: LoadingController,
    public imgstore: ImghandlerProvider, public call: CallNumber, public alertCtrl: AlertController,
    public speechRec: SpeechRecognition) {

    this.buddy = this.chatservice.buddy;
    console.log("buddy",this.buddy)
    this.phoneNumber = this.buddy.phoneNumber;
    this.buddyName = this.buddy.displayName;
    this.photoURL = firebase.auth().currentUser.photoURL;
    this.scrollto();
    this.events.subscribe('newmessage', () => {
      this.allmessages = [];
      this.imgornot = [];
      this.zone.run(() => {
        this.allmessages = this.chatservice.buddymessages;
        for (var key in this.allmessages) {
          if (this.allmessages[key].message.substring(0, 4) == 'http')
            this.imgornot.push(true);
          else
            this.imgornot.push(false);
        }
      })
      
      
    })
  }

  callNumber() {

  this.call.callNumber(this.phoneNumber, true)
  .then(() => console.log('Launched dialer!'))
  .catch(() => console.log('Error launching dialer'));

  }

  presentConfirm() {
  let alert = this.alertCtrl.create({
    title: 'Confirm Call',
    message: 'Do you want to call ' + this.buddyName + '?' ,
    buttons: [
      {
        text: 'No',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Yes',
        handler: () => {
          this.callNumber()
        }
      }
    ]
  });
  alert.present();
  }

  start() {
    this.speechRec.startListening()
    .subscribe(
        (matches: Array<string>) => {
          this.newmessage = matches[0];
          this.addmessage(this.newmessage)

        }
      )
  }


  addmessage(newmessage) {
    this.chatservice.addnewmessage(newmessage).then(() => {
      this.content.scrollToBottom();
      this.newmessage = '';
    })
  }

  ionViewDidEnter() {
    this.chatservice.getbuddymessages();
  }

  scrollto() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 1000);
  }

  sendPicMsg() {
    let loader = this.loadingCtrl.create({
      content: 'Please wait'
    });
    loader.present();
    this.imgstore.picmsgstore().then((imgurl) => {
      loader.dismiss();
      this.chatservice.addnewmessage(imgurl).then(() => {
        this.scrollto();
        this.newmessage = '';
      })
    }).catch((err) => {
      alert(err);
      loader.dismiss();
    })
    loader.dismiss();
  }
}