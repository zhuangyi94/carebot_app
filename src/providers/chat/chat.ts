import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Events } from 'ionic-angular';

/*
  Generated class for the ChatProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ChatProvider {
  firebuddychats = firebase.database().ref('/buddychats');
  firebotchats =  firebase.database().ref('/botchats');
  buddy: any;
  buddymessages = [];
  constructor(public events: Events) {
    
  }

  initializebuddy(buddy) {
    this.buddy = buddy;
  }

  addnewbotmessage(msg) {
    console.log("hdhdhhd")
    var ref = firebase.database().ref('/bodychats');
    var promise = new Promise((resolve, reject) => {
      ref.once("value")
        .then(function(snapshot) {
          var firsttimer = snapshot.hasChild("messages");
          if(firsttimer==false){
              console.log("im first time")
              
          }
          else{
              console.log("Im not first time")
              
          }
    }).then(()=>{
      resolve(true)
    }).catch((err) =>{
      reject(err);
    })


  }) 
    return promise;
  }

  addnewmessage(msg) {
    if (this.buddy) {
      var promise = new Promise((resolve, reject) => {
        this.firebuddychats.child(firebase.auth().currentUser.uid).child(this.buddy.uid).push({
          sentby: firebase.auth().currentUser.uid,
          message: msg,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
          this.firebuddychats.child(this.buddy.uid).child(firebase.auth().currentUser.uid).push().set({
            sentby: firebase.auth().currentUser.uid,
            message: msg,
            timestamp: firebase.database.ServerValue.TIMESTAMP
          }).then(() => {
            resolve(true);
            }).catch((err) => {
              reject(err);
          })
        })
      })
      return promise;
    }
    else{

console.log("yess")
    var promise = new Promise((resolve, reject) => {
        this.firebotchats.child(firebase.auth().currentUser.uid).push({
          sentby: firebase.auth().currentUser.uid,
          message: msg,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
            resolve(true);
            })
        })
      
      return promise;
    }
  }

  getbuddymessages() {
    
    let temp;
    this.firebuddychats.child(firebase.auth().currentUser.uid).child(this.buddy.uid).on('value', (snapshot) => {
      this.buddymessages = [];
      temp = snapshot.val();
      for (var tempkey in temp) {
        this.buddymessages.push(temp[tempkey]);
      }
      this.events.publish('newmessage');
    })
  }

  getbotmessages() {
    
    console.log("success get into botmsg")
    let temp;
    this.firebotchats.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
      this.buddymessages = [];
      temp = snapshot.val();
      console.log("temp = ",temp)
      for (var tempkey in temp) {
        this.buddymessages.push(temp[tempkey]);
      }
      console.log("msg = ", this.buddymessages)
      this.events.publish('newmessage');
    })
  }

}