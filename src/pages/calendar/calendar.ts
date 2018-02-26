import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import * as moment from 'moment';
import firebase from 'firebase';
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

  constructor(public navCtrl: NavController, 
  	public navParams: NavParams,
  	public viewCtrl: ViewController) {

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
  	console.log("event = ", this.eventToFirebase)
    //var ref = firebase.database().ref('/calendarEvent');
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
    
  }

}
