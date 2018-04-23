import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { connreq } from '../../models/interfaces/request';
import { UserProvider } from '../user/user';
import firebase from 'firebase';

/*
  Generated class for the RequestsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class RequestsProvider {
  firereq = firebase.database().ref('/requests');
  firefriends = firebase.database().ref('/friends');
  user = firebase.database().ref('/users');
  bot = firebase.database().ref('/botchats');
  calendar = firebase.database().ref('/calendarEvent')
  
  userdetails;
  myfriends;
  myGuardian;
  myElderly;
  myBotMsg;
  constructor(public userservice: UserProvider, public events: Events) {
    
  }

  sendrequest(req: connreq) {
    var promise = new Promise((resolve, reject) => {
      this.firereq.child(req.recipient).push().set({
      sender: req.sender
      }).then(() => {
        resolve({ success: true });
        }).catch((err) => {
          resolve(err);
    })
    })
    return promise;  
  }

  getmyrequests() {
    let allmyrequests;
    var myrequests = [];
    this.firereq.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
      allmyrequests = snapshot.val();
      myrequests = [];
      for (var i in allmyrequests) {
        myrequests.push(allmyrequests[i].sender);
      }
      this.userservice.getallusers().then((res) => {
        var allusers = res;
        this.userdetails = [];
        for (var j in myrequests)
          for (var key in allusers) {
            if (myrequests[j] === allusers[key].uid) {
              this.userdetails.push(allusers[key]);
            }
          }
        this.events.publish('gotrequests');
      })

  })
  }  

  acceptrequest(buddy) {
    var promise = new Promise((resolve, reject) => {
      this.myfriends = [];
      this.firefriends.child(firebase.auth().currentUser.uid).push().set({
        uid: buddy.uid
      }).then(() => {
        this.firefriends.child(buddy.uid).push().set({
          uid: firebase.auth().currentUser.uid
        }).then(() => {
          this.deleterequest(buddy).then(() => {
          resolve(true);
        })
        
        }).catch((err) => {
          reject(err);
         })
        }).catch((err) => {
          reject(err);
      })
    })
    return promise;
  }

  deleterequest(buddy) {
    var promise = new Promise((resolve, reject) => {
     this.firereq.child(firebase.auth().currentUser.uid).orderByChild('sender').equalTo(buddy.uid).once('value', (snapshot) => {
          let somekey;
          for (var key in snapshot.val())
            somekey = key;
          this.firereq.child(firebase.auth().currentUser.uid).child(somekey).remove().then(() => {
            resolve(true);
          })
         })
          .then(() => {
          
        }).catch((err) => {
          reject(err);
        })
    })
    return promise; 
  }

  getmyfriends() {
    let friendsuid = [];
    this.firefriends.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
      let allfriends = snapshot.val();
      this.myfriends = [];
      for (var i in allfriends)
        friendsuid.push(allfriends[i].uid);
        
      this.userservice.getallusers().then((users) => {
        this.myfriends = [];
        for (var j in friendsuid)
          for (var key in users) {
            if (friendsuid[j] === users[key].uid) {
              this.myfriends.push(users[key]);
            }
          }
        this.events.publish('friends');
      }).catch((err) => {
        alert(err);
      })
    
    })
  }

  getmyGuardian() {
    let email = [];
    this.user.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
      let guardian = snapshot.val();
      this.myGuardian = [];
      for (var i in guardian)
          email.push(guardian[i]);         


      console.log("guardian")
      this.userservice.getallusers().then((users) => {
        this.myGuardian = [];
          for (var key in users) {
            if (email[3] === users[key].elderlyEmail) {
              this.myGuardian.push(users[key]);
            }
          }
          console.log("xxx",this.myGuardian)
        this.events.publish('guardian');
      }).catch((err) => {
        alert(err);
      })      

      })


  }

  getmyElderly() {

    let email = [];
    this.user.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
      let elderly = snapshot.val();
      this.myElderly = [];
      for (var i in elderly)
          email.push(elderly[i]);         


      console.log("elderly")
      this.userservice.getallusers().then((users) => {
        this.myElderly = [];
          for (var key in users) {
            if (email[2] === users[key].email) {
              this.myElderly.push(users[key]);
            }
          }
          console.log("elderly",this.myElderly)
        this.events.publish('elderly');
      }).catch((err) => {
        alert(err);
      })      

      })

  }

  getElderlyMessage(elderUid){

    var promise = new Promise ((resolve,reject) => {
      let msg = [];
      this.bot.child(elderUid).on('value', (snapshot) => {        
        let elderlymsg = snapshot.val();
        this.myBotMsg = [];
          for(var i in elderlymsg){
            if(elderlymsg[i].sentby!='bot'){
              msg.push(elderlymsg[i]);              
            }
          }
          resolve(msg)
      })
    })
    return promise;
  }

  getElderlyPolarity(elderUid,checkWeekly){

    var promise = new Promise ((resolve,reject) =>{
      //let polarity = 0;
      let analysis = {
        polarity:0,
        positive:0,
        neutral:0,
        negative:0
      };
      let count = 0;

      this.bot.child(elderUid).on('value', (snapshot) => {
        let botmsg = snapshot.val();
          for(var i in botmsg){
            if(botmsg[i].sentby=='bot' && botmsg[i].message!='welcome'){
               //console.log(new Date(botmsg[i].timestamp))
                console.log("botmsg", botmsg[i].message)
                var curr = new Date;
                //console.log("curr",curr.getDay())
                var timestamps = new Date(botmsg[i].timestamp);
                
                var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay() +1));
                firstday.setHours(0,0,0,0);

                var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() +7));
                lastday.setHours(23,59,0,0);
                
                var firstdayofMonth = new Date(curr.setDate(1));
                firstdayofMonth.setHours(0,0,0,0);

                var lastdayofMonth = new Date(curr.setDate(31));
                lastdayofMonth.setHours(23,59,0,0)

                console.log("firstday",firstday)
                console.log("lastday",lastday)
                // console.log("firstmonth",firstdayofMonth)
                // console.log("lastdayofmonth",lastdayofMonth)
                // console.log("checkweekly = ", checkWeekly)
                // console.log("timestamp = ", timestamps)

                if(checkWeekly==true){
                      if(firstday<=timestamps && lastday>=timestamps)
                      {
                      let value = (Number(botmsg[i].polarity))*2;
                      console.log("before value", value)
                      if(value==0){
                        value=0.5;
                        analysis.neutral++;
                      }else if(value==-1){
                        value=0;
                        analysis.negative++; 
                      }
                      else if(value==1){
                        value=1;
                        analysis.positive++;
                      }
                      else if(value>1){
                        value=1;
                        analysis.positive++;
                      }
                      else if(value>0){
                        analysis.positive++;
                      }else{
                        analysis.negative++;
                      }
                      Math.abs(value);
                      analysis.polarity+=value;
                      //console.log("p",polarity)
                      count++;
                      console.log("value",value)                  
                      }

                }else{
                    if(firstdayofMonth<=timestamps && lastdayofMonth>=timestamps){
                        let value = (Number(botmsg[i].polarity))*2;
                        console.log("before value", value)
                        if(value==0){
                          value=0.5;
                          analysis.neutral++;
                        }else if(value==-1){
                          value=0;
                          analysis.negative++; 
                        }
                        else if(value==1){
                          value=1;
                          analysis.positive++;
                        }
                        else if(value>1){
                          value=1;
                          analysis.positive++;
                        }
                        else if(value>0){
                          analysis.positive++;
                        }else{
                          analysis.negative++;
                        }
                        Math.abs(value);
                        analysis.polarity+=value;
                        //console.log("p",polarity)
                        count++;
                        console.log("value",value)                      
                      }

                }             

            }
          }
          analysis.polarity = (analysis.polarity/count)*10;

          resolve(analysis)
      })
    })
    return promise;
  }

  getCalendarDetails(){

    var promise = new Promise ((resolve,reject) => {
      let schedule = [];
      this.calendar.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
        
        let calendarInfo = snapshot.val();
        this.myBotMsg = [];
          for(var i in calendarInfo){
            //if(elderlymsg[i].sentby!='bot'){
              schedule.push(calendarInfo[i]);              
            //}
          }
          console.log("schedule how?", schedule)
          resolve(schedule)
      })
    })
    return promise;
  } 



  getGuardianPhone(){

    var promise = new Promise ((resolve,reject) => {

    let myGuardian = [];
    let email = [];
    this.user.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
      let elderly = snapshot.val();
      //this.myElderly = [];
      for (var i in elderly)
          email.push(elderly[i]);         


      console.log("elderly")
      this.userservice.getallusers().then((users) => {
        //this.myGuardian = [];
          for (var key in users) {
            if (email[3] === users[key].elderlyEmail) {
              myGuardian.push(users[key]);
            }
          }
          console.log("elderly",myGuardian)
          resolve(myGuardian)
        //this.events.publish('elderly');
      }).catch((err) => {
        alert(err);
      })      

      })
  })
  return promise;
  }
 

  getInvitationCode(){

    var promise = new Promise ((resolve,reject) => {

    let code: string;
    let information = [];
    this.user.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
      let elderly = snapshot.val();
      //this.myElderly = [];
      for (var i in elderly)
          information.push(elderly[i]);         
      })

      code = information[0];
      console.log(code)
      resolve(code);
  })
  return promise;
  }


}