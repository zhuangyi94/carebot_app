import { Component } from '@angular/core';
import { IonicPage, 
	NavController, 
	NavParams,
	AlertController,
	ModalController } from 'ionic-angular';
import * as moment from 'moment';
import firebase from 'firebase';
//import { LocalNotifications } from '@ionic-native/local-notifications';
/**
 * Generated class for the CalendarviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-calendarview',
  templateUrl: 'calendarview.html',
})
export class CalendarviewPage {

  eventSource = [];
  viewTitle: string;
  selectedDay = new Date();
  calendarMsg;
  fireCalendarEvent =  firebase.database().ref('/calendarEvent');
  source = "";
 
  calendar = {
  mode: 'month',
  currentDate: new Date()

  };
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public modalCtrl: ModalController,
  	public alertCtrl: AlertController,
    //public localNot: LocalNotifications
    ) {


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CalendarviewPage');
    //this.getCalendar();
  }

  // ionViewWillEnter() {
  //   let tabs = document.querySelectorAll('.tabbar');
  //   if ( tabs !== null ) {
  //     Object.keys(tabs).map((key) => {
  //       tabs[ key ].style.transform = 'translateY(56px)';
  //     });
  //   } // end if
  // }

  // ionViewDidLeave() {
  //   let tabs = document.querySelectorAll('.tabbar');
  //   if ( tabs !== null ) {
  //     Object.keys(tabs).map((key) => {
  //       tabs[ key ].style.transform = 'translateY(0)';
  //     });
  //   } // end if
  // }

  ngOnInit(){

    this.source = this.navParams.data.elderlyUid;
    this.getCalendar(this.source);
    // this.localNot.hasPermission()
    // .then((hasPermission: boolean) => {

    //   if(!hasPermission){
    //     this.localNot.requestPermission()
    //     .then(
    //         () => console.log('Granted'),
    //         () => console.log('Deneied')
    //       )
    //   }
    // });
  }

  addEvent() {
    let modal = this.modalCtrl.create('CalendarPage', {selectedDay: this.selectedDay});
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        console.log("data",data)
        this.getCalendar(this.source);
        
        // this.localNot.schedule({
        //    text: 'Delayed ILocalNotification',
        //    trigger: { at: data.startTime},
        //    led: 'FF0000',
        //    sound: null
        // });     

        // let eventData = data;
 
        // eventData.startTime = new Date(data.startTime);
        // eventData.endTime = new Date(data.endTime);
 
        // let events = this.eventSource;
        // events.push(eventData);
        // this.eventSource = [];
        // setTimeout(() => {
        //   this.eventSource = events;
        // });
      }
    });
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }
 
  onEventSelected(event) {
    let start = moment(event.startTime).format('LLLL');
    let end = moment(event.endTime).format('LLLL');
    
    let alert = this.alertCtrl.create({
      title: '' + event.title,
      subTitle: 'From: ' + start + '<br>To: ' + end,
      buttons: ['OK']
    })
    alert.present();
  }
 
  onTimeSelected(ev) {
    this.selectedDay = ev.selectedTime;
  }

  getCalendar(source) {
    let temp;
    let count = 0;
    let currentUid = "";

    if(source!=firebase.auth().currentUser.uid){
      currentUid = source;
    }else{
      currentUid = firebase.auth().currentUser.uid;
    }

    //this.eventSource = [];
    this.fireCalendarEvent.child(currentUid).on('value', (snapshot) => {
      this.calendarMsg = [];
      temp = snapshot.val();
      console.log("temp = ",temp)
      for (var tempkey in temp) {
        this.calendarMsg.push(temp[tempkey]);
        console.log("hi",count,this.calendarMsg,tempkey)
        this.calendarMsg[count].startTime = new Date(temp[tempkey].startTime);
        this.calendarMsg[count].endTime = new Date(temp[tempkey].endTime);
        count++;
      }
      count=0;
      //console.log(this.calendarMsg)

      this.eventSource = this.calendarMsg;
      //this.events.publish('newmessage');
    })
  }





}
