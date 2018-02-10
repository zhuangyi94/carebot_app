import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Content, LoadingController } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { ImghandlerProvider } from '../../providers/imghandler/imghandler';
import { Http, Headers, RequestOptions } from '@angular/http';
import firebase from 'firebase';
import { SpeechRecognition } from '@ionic-native/speech-recognition'
/**
 * Generated class for the ChatbotPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chatbot',
  templateUrl: 'chatbot.html',
})
export class ChatbotPage {
  @ViewChild('content') content: Content;
  buddy: any;
  newmessage;
  botmessage;
  allmessages = [];
  photoURL;
  imgornot;
  firebotchats;
  fireschedule;
  setSchedulePara;
  days;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams, 
  	public chatservice: ChatProvider,
    public events: Events, 
    public zone: NgZone, 
    public loadingCtrl: LoadingController,
    public imgstore: ImghandlerProvider,
    public http: Http,
    public speechRecognition: SpeechRecognition){

    this.days = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
    this.buddy = this.chatservice.buddy;
    this.setSchedulePara = false;
    this.botmessage = null;
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

  ngOnInit() {
    this.speechRecognition.hasPermission()
    .then((hasPermission: boolean) => {

      if(!hasPermission){
        this.speechRecognition.requestPermission()
        .then(
            () => console.log('Granted'),
            () => console.log('Deneied')
          )
      }
    });

  }

  start() {
    this.speechRecognition.startListening()
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

    if(this.setSchedulePara==false){
      this.api3(newmessage)
    }
    else{
      this.setupSchedule(newmessage)
    }
    
    
  }

  setupSchedule(newmessage) {

    var i;

      if(newmessage.match(/Monday/,/Tuesday/,/Wednesday/,/Thursday/,/Friday/,/Saturday/,/Sunday/)){
          this.firebotchats.child(firebase.auth().currentUser.uid).push({
            sentby:  "bot",
            message: "noted.",
            timestamp: firebase.database.ServerValue.TIMESTAMP
          })
          this.fireschedule.child(firebase.auth().currentUser.uid).push({
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            time: newmessage
          })
        
      }
    
    



  }

  getBotMessages() {

        var promise = new Promise((resolve, reject) => {
        this.firebotchats.child(firebase.auth().currentUser.uid).push({
          sentby: "bot",
          message: "welcome",
          timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
          
            resolve(true);
            }).catch((err) => {
              reject(err);
          })
        
      })

      return promise;

  }

    api3(msg) {

        let headers = new Headers({ "content-type": "application/json", "Accept": "application/json" });
        let options = new RequestOptions({ headers: headers });
        this.http.post('http://192.168.43.10:8000/employees2/?format=json', JSON.stringify(msg), options)
        .subscribe(data => {
            this.botmessage=data.json()
            console.log("nested botmsg= ",this.botmessage)
            if(this.botmessage=="May i know the time u would like to set up?"){
                  this.setSchedulePara = true;
            }

            var promise = new Promise((resolve, reject) => {
        this.firebotchats.child(firebase.auth().currentUser.uid).push({
          sentby: "bot",
          message: this.botmessage,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
          
            resolve(true);
            }).catch((err) => {
              reject(err);
          })
        
      })

      return promise;

        }, error => {
            console.log(JSON.stringify(error.json()));
        });

  }


  ionViewDidEnter() {

  	var firsttimer = null;
  	  this.firebotchats =  firebase.database().ref('/botchats');
      this.fireschedule = firebase.database().ref('/schedule');

  	  this.firebotchats.once("value").then( snapshot =>{
  	  	firsttimer = snapshot.hasChild((firebase.auth().currentUser.uid));
        if(firsttimer==false){
          this.getBotMessages()
        }


  	  })

      this.chatservice.getbotmessages()

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
  }
}
