import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import * as moment from 'moment';
import firebase from 'firebase';
import { UserProvider } from '../../providers/user/user';
//import { LocalNotifications } from '@ionic-native/local-notifications';
/**
 * Generated class for the CalendarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})
export class CalendarPage {
  
  event = { startTime: new Date().toISOString(), endTime: new Date().toISOString(), allDay: false, title:"" };
  eventToFirebase = this.event;
  minDate = new Date().toISOString();
  fireCalendarEvent =  firebase.database().ref('/calendarEvent');
  elderly;
  elderlyUid;

  constructor(public navCtrl: NavController, 
  	public navParams: NavParams,
  	public viewCtrl: ViewController,
    public userProvider: UserProvider
    //public localNotifications: LocalNotifications
    ) {

  	let preselectedDate = moment(this.navParams.get('selectedDay')).format();
  	console.log(this.navParams.get('selectedDay'));
  	//this.eventToFirebase.startTime = this.navParams.get('selectedDay');
  	//this.eventToFirebase.endTime = this.navParams.get('selectedDay');
    this.event.startTime = preselectedDate;
    this.event.endTime = preselectedDate;
  }

  ionViewDidLoad() {
    
  }

  cancel() {
    this.viewCtrl.dismiss();
  }
 
  save() {
  	//console.log("event = ", this.eventToFirebase)
    //var ref = firebase.database().ref('/calendarEvent');
    this.userProvider.getuserdetails().then((res: any) => {
      if(res.elderlyEmail="undefined"){
        var promise = new Promise((resolve, reject) => {
          this.fireCalendarEvent.child(firebase.auth().currentUser.uid).push({
            title: this.event.title,
            allDay: this.event.allDay,
            startTime: this.event.startTime,
            endTime: this.event.endTime,
            timestamp: firebase.database.ServerValue.TIMESTAMP
          }).then(() => {
              resolve(true);
              this.viewCtrl.dismiss(this.event);
              })
          })
        
        return promise;        
      }else{
        this.userProvider.getuserdetails().then((res: any) => {
          this.elderly = res.elderlyEmail;
          
        }).then((res: any) => {
          this.userProvider.getelderlydetails(this.elderly).then((res:any) =>{
            this.elderlyUid = res[0].uid;
            var promise = new Promise((resolve, reject) => {
              this.fireCalendarEvent.child(this.elderlyUid).push({
                title: this.event.title,
                allDay: this.event.allDay,
                startTime: this.event.startTime,
                endTime: this.event.endTime,
                timestamp: firebase.database.ServerValue.TIMESTAMP
              }).then(() => {

                  // this.localNotifications.schedule({
                  //    text: 'Delayed ILocalNotification',
                  //    at: this.event.startTime,
                  //    led: 'FF0000',
                  //    sound: null
                  // });

                  resolve(true);
                  this.viewCtrl.dismiss(this.event);
                  })
              })
            
            return promise;    
          })        

        });
    
      }    
    })
  }

}
