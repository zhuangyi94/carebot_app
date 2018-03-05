import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Content, LoadingController, AlertController } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { ImghandlerProvider } from '../../providers/imghandler/imghandler';
import { Http, Headers, RequestOptions } from '@angular/http';
import firebase from 'firebase';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { RequestsProvider } from '../../providers/requests/requests';
import * as moment from 'moment';
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
  testing;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams, 
  	public chatservice: ChatProvider,
    public events: Events, 
    public zone: NgZone, 
    public loadingCtrl: LoadingController,
    public imgstore: ImghandlerProvider,
    public http: Http,
    public speechRecognition: SpeechRecognition,
    public texttoSpeeech: TextToSpeech,
    public request: RequestsProvider,
    public alertCtrl: AlertController){

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
        console.log(this.allmessages)
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
      this.api3(newmessage)
      this.content.scrollToBottom();
      this.newmessage = '';
    })

    //if(this.setSchedulePara==false){

    //}
    //else{
      //this.setupSchedule(newmessage)
    //}
    
    
  }

  setupSchedule(newmessage) {

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


  public organizeDialog(res){

    let content = "";
    let temp = [];

      temp = res;
      temp.forEach(r=>{
        let date = new Date(r.startTime);
        let dates = moment(date).format('lll'); ;
        content+="<li>" + dates + "<br>" + r.title +'</li>';
      })    
    console.log("content", content)


    let alert = this.alertCtrl.create({
      title:"Schedule",
      subTitle:content,
      buttons:['Close']
    })
      alert.present();
  }

    api3(msg) {

      console.log("im here!",msg)

        let headers = new Headers({ "content-type": "application/json", "Accept": "application/json" });
        let options = new RequestOptions({ headers: headers });
        //this.http.post('http://10.207.156.182:8000/employees2/?format=json', JSON.stringify(msg), options)
        //this.http.post('http://192.168.1.14:8000/employees2/?format=json', JSON.stringify(msg), options)
        this.http.post('http://192.168.43.10:8000/employees2/?format=json', JSON.stringify(msg), options)
        //this.http.post('http://10.207.200.225:8000/employees2/?format=json', JSON.stringify(msg), options)
        .subscribe(data => {
                      console.log(data)
            this.botmessage=data.json()
            this.botmessage=JSON.parse(this.botmessage)
            console.log("lets see what we received",this.botmessage)
            if(this.botmessage.message=="Here you go"){
              console.log("hi, finally get into here")
              this.request.getCalendarDetails().then((res:any) => {
                console.log("request",res)
                this.testing=res;
                this.organizeDialog(this.testing);
                //this.botmessage=res;
              })
            }

            if(this.botmessage.polarity[0]< (-0.4)){
              console.log("sad!!!!!")
              this.botmessage.message = this.botmessage.message + " . If you faced any difficulties, don't hesitate to contact your family, they are always ready for you."
            }
            else if(this.botmessage.polarity[0]< (-0.7)){
              this.botmessage.message = this.botmessage.message + "Do you need me contact your family? im really worried about you."
            }
            // console.log("nested botmsg= ",this.botmessage.polarity, this.botmessage, this.botmessage.message)
            // if(this.botmessage=="May i know the time u would like to set up?"){
            //       this.setSchedulePara = true;
            // }


        var promise = new Promise((resolve, reject) => {

        this.firebotchats.child(firebase.auth().currentUser.uid).push({
          sentby: "bot",
          message: this.botmessage.message,
          polarity: this.botmessage.polarity[0],
          timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
            this.texttoSpeeech.speak(this.botmessage.message)
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
