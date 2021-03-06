import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserProvider {
  firedata = firebase.database().ref('/users');
  constructor(public afireauth: AngularFireAuth) {
  }

  /*

  Adds a new user to the system.

  Called from - signup.ts
  Inputs - The new user object containing the email, password and displayName.
  Outputs - Promise.
  
   */

  adduser(newuser) {

    var promise = new Promise((resolve) => {

      let allowed:boolean =true;
      let errormsg = null;


      if(allowed=true){



        if(newuser.elderlyEmail && newuser.elderlyCode){
          this.firedata.orderByChild('email').equalTo(newuser.elderlyEmail).on("value", snapshot => {
            let firedata = firebase.database().ref('/users');

            let data = snapshot.val();
            let emailCache = "";     
                  
            console.log(data)
            for(let item in data){
              emailCache = item;
            }
            console.log("emailCache",emailCache)
            firedata.child(emailCache).update({
              guardianEmail: newuser.email
            })
          })
        }




        this.afireauth.auth.createUserWithEmailAndPassword(newuser.email, newuser.password).then(() => {
          this.afireauth.auth.currentUser.updateProfile({
            displayName: newuser.displayName,
            photoURL: 'https://firebasestorage.googleapis.com/v0/b/myapp-4eadd.appspot.com/o/chatterplace.png?alt=media&token=e51fa887-bfc6-48ff-87c6-e2c61976534e'
          }).then(() => {

            let codes = Math.random().toString(36).substr(2,5)
            console.log("newuser",newuser)

            this.firedata.child(this.afireauth.auth.currentUser.uid).set({
              uid: this.afireauth.auth.currentUser.uid,
              displayName: newuser.displayName,
              email: newuser.email,
              elderlyEmail: newuser.elderlyEmail? newuser.elderlyEmail : "undefined",
              phoneNumber: newuser.phone,
              code: codes,
              photoURL: 'https://firebasestorage.googleapis.com/v0/b/myapp-4eadd.appspot.com/o/chatterplace.png?alt=media&token=e51fa887-bfc6-48ff-87c6-e2c61976534e'
            }).then(() => {
              resolve({ success: true });
              }).catch((err) => {
                resolve(err);
            })
            }).catch((err) => {
              resolve(err);
          })
        }).catch((err) => {
          resolve(err);
        })
      }
      else{

        resolve(errormsg)
      }
      

    })
    return promise;
  }

  checkEmail(newuser){
    var promise = new Promise((resolve) => {
    this.afireauth.auth.signInWithEmailAndPassword(newuser.elderlyEmail,newuser.password).then((resolve) => {
        resolve({ success: true });
      }).catch((err) => {
        resolve(err);
      })
    })
    return promise;
  }

  checkCode(newuser){
    var promise = new Promise((resolve) => {
        this.firedata.child(this.afireauth.auth.currentUser.uid).once('value', (snapshot) => {
          
          let data =  snapshot.val();
          let temparr = [];
          let decision = true;

          for (var key in data) {
            temparr.push(data[key]);
          }
          if(temparr[0]==newuser.code){
            console.log("yea, it is true")
            decision = true;
          }else{
            console.log("nope, it is false",temparr[0],newuser.elderlyCode)
            decision = false;
          }
           resolve(decision)     
        })
    })
    return promise
  }

  /*

  For resetting the password of the user.
  Called from - passwordreset.ts
  Inputs - email of the user.
  Output - Promise.
  
   */

  passwordreset(email) {
    console.log(email)
    var promise = new Promise((resolve) => {
      firebase.auth().sendPasswordResetEmail(email).then(() => {
        resolve({ success: true });
      }).catch((err) => {
        resolve(err);
      })
    })
    return promise;
  }

  /*
  
  For updating the users collection and the firebase users list with
  the imageurl of the profile picture stored in firebase storage.

  Called from - profilepic.ts
  Inputs - Url of the image stored in firebase.
  OUtputs - Promise.
  
  */

  updateimage(imageurl) {
      var promise = new Promise((resolve, reject) => {
          this.afireauth.auth.currentUser.updateProfile({
              displayName: this.afireauth.auth.currentUser.displayName,
              photoURL: imageurl      
          }).then(() => {
              firebase.database().ref('/users/' + firebase.auth().currentUser.uid).update({
              displayName: this.afireauth.auth.currentUser.displayName,
              photoURL: imageurl,
              uid: firebase.auth().currentUser.uid
              }).then(() => {
                  resolve({ success: true });
                  }).catch((err) => {
                      reject(err);
                  })
          }).catch((err) => {
                reject(err);
             })  
      })
      return promise;
  }

  getuserdetails() {
    var promise = new Promise((resolve, reject) => {
    this.firedata.child(firebase.auth().currentUser.uid).once('value', (snapshot) => {
      resolve(snapshot.val());
    }).catch((err) => {
      reject(err);
      })
    })
    return promise;
  }

  getelderlydetails(elderEmail) {
    var promise = new Promise((resolve, reject) => {
      this.firedata.orderByChild('email').equalTo(elderEmail).once("value", snapshot => {
        let userdata = snapshot.val();
        let temparr = [];
        for (var key in userdata) {
          temparr.push(userdata[key]);
        }
        console.log("check", temparr)
        resolve(temparr);
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }

  updatedisplayname(newname) {
    var promise = new Promise((resolve, reject) => {
      this.afireauth.auth.currentUser.updateProfile({
      displayName: newname,
      photoURL: this.afireauth.auth.currentUser.photoURL
    }).then(() => {
      this.firedata.child(firebase.auth().currentUser.uid).update({
        displayName: newname,
        photoURL: this.afireauth.auth.currentUser.photoURL,
        uid: this.afireauth.auth.currentUser.uid
      }).then(() => {
        resolve({ success: true });
      }).catch((err) => {
        reject(err);
      })
      }).catch((err) => {
        reject(err);
    })
    })
    return promise;
  }


  getallusers() {
    var promise = new Promise((resolve, reject) => {
      this.firedata.orderByChild('uid').once('value', (snapshot) => {
        let userdata = snapshot.val();
        let temparr = [];

        console.log(snapshot.val())
        for (var key in userdata) {
          if(userdata[key].uid!=this.afireauth.auth.currentUser.uid){
             temparr.push(userdata[key]);           
          }

        }
        resolve(temparr);
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }

}
