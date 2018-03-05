import { Component, NgZone } from '@angular/core';
import { IonicPage, 
  NavController, 
  NavParams, 
  AlertController,
  ModalController,
  Platform } from 'ionic-angular';
import { RequestsProvider } from '../../providers/requests/requests';
import { ImghandlerProvider } from '../../providers/imghandler/imghandler';
import { ChatProvider } from '../../providers/chat/chat';
import { UserProvider } from '../../providers/user/user';
import { HTTP } from '@ionic-native/http';
import { Http, Headers, RequestOptions } from '@angular/http';
import firebase from 'firebase';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { LocalNotifications } from '@ionic-native/local-notifications'
import { CallNumber } from '@ionic-native/call-number';
import * as moment from 'moment';
//import { CalendarModule } from 'ionic2-calendar2';
/**
 * Generated class for the ProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  avatar: string;
  displayName: string;
  testing: string;
  data:string;
  calendarMsg;
  openC = true;
  hideAnalysis = true;
  buddy;
  buddyName;
  buddyPhone;

  randomnumber:string = "";

  ///
  eventSource = [];
  viewTitle: string;
  selectedDay = new Date();
  fireCalendarEvent =  firebase.database().ref('/calendarEvent');
  fireUser = firebase.database().ref('/users');

  calendar = {
    mode:'month',
    currentDate: this.selectedDay
  }
  ///


  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public userservice: UserProvider, 
    public zone: NgZone, 
    public alertCtrl: AlertController,
    public imghandler: ImghandlerProvider, 
    public http: HTTP, 
    public http2: Http,
    public speechRecognition: SpeechRecognition,
    public localNotifications: LocalNotifications,
    public alertController: AlertController,
    public plt: Platform,
    public callNumber: CallNumber,
    public modalCtrl: ModalController,
    public chatProvider: ChatProvider,
    public requestProvider: RequestsProvider) {

      this.plt.ready().then( (rdy) => {


        this.buddy = this.chatProvider.buddy;
        console.log("buddy",this.buddy)
        //this.buddyName = this.buddy.displayName;
        //this.buddyPhone = this.buddy.phoneNumber;
        this.requestProvider.getGuardianPhone().then(res=>{
          this.buddyName = res[0].displayName;
          this.buddyPhone = res[0].phoneNumber;
          //console.log("hre", res)
        })

        this.openC = true;
        this.localNotifications.on('click', (notification, state) =>{

          let alert = this.alertController.create({
            title: notification.title,
            subTitle: notification.data.mydata
          });
          alert.present();
        });
      });
  }

  getInvitationCode() {
    this.requestProvider.getInvitationCode().then(res=>{
    
      let code = res.toString();

      let alert = this.alertCtrl.create({
        title: 'Invitation Code',
        subTitle: code,
        buttons: ['OK']
      })
      
      alert.present();
    })
  }

  openChart() {
    this.navCtrl.push('ChatAnalysisPage');
  }

  openCalendar() {
    //this.openC = false;
    this.navCtrl.push('CalendarviewPage', {elderlyUid: firebase.auth().currentUser.uid});
  } 

  addEvent() {
    let modal = this.modalCtrl.create('CalendarPage', {selectedDay: this.selectedDay});
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {

        console.log("data",data)
        let eventData = data;
 
        eventData.startTime = new Date(data.startTime);
        eventData.endTime = new Date(data.endTime);
 
        let events = this.eventSource;
        events.push(eventData);
        this.eventSource = [];
        setTimeout(() => {
          this.eventSource = events;
        });
      }
    });
  }

  onViewTitleChanged(title){
    this.viewTitle = title;
  }
  onTimeSelected(ev){
    this.selectedDay = ev.selectedTime;
  }
  onEventSelected(event) {
    console.log("event=",event)
    let start = moment(event.startTime).format('LLLL');
    let end = moment(event.endTime).format('LLLL');
    
    let alert = this.alertCtrl.create({
      title: '' + event.title,
      subTitle: 'From: ' + start + '<br>To: ' + end,
      buttons: ['OK']
    })
    alert.present();
  }

  ionViewWillEnter() {
    this.loaduserdetails();

  }

  getCalendar() {
    let temp;
    let count = 0;
    this.fireCalendarEvent.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
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

  ionViewDidLoad() {
    //this.getCalendar();

  }


  loaduserdetails() {
    this.userservice.getuserdetails().then((res: any) => {
      this.displayName = res.displayName;
      this.testing="hi";
      this.zone.run(() => {
        this.avatar = res.photoURL;
      })
    })
  }

  presentConfirm() {
  let alert = this.alertCtrl.create({
    title: 'Confirm Call',
    message: 'Do you want to call ' + this.buddyName + '?',
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
          this.call()
        }
      }
    ]
  });
  alert.present();
  }

  call() {

    this.callNumber.callNumber(this.buddyPhone, true)
  .then(() => console.log('Launched dialer!'))
  .catch(() => console.log('Error launching dialer'));

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

    this.localNotifications.hasPermission()
    .then((hasPermission: boolean) => {

      if(!hasPermission){
        this.speechRecognition.requestPermission()
        .then(
            () => console.log('Granted'),
            () => console.log('Deneied')
          )
      }
    });

      this.userservice.getuserdetails().then((res:any)=>{
        console.log("first",res)
        if(res.elderlyEmail=="undefined"){
          this.hideAnalysis=false;
        }else{
          
          this.hideAnalysis=true;
          console.log("first and half",this.hideAnalysis)
        } 
      })

  }

  number(){
    this.randomnumber = Math.random().toString(36).substr(2,5);
  }

  public hideAnalysisFunc(){
    console.log("second",this.hideAnalysis)
    
    if(this.hideAnalysis==true){
      return true;
    }else{
      return false;
    } 
  }

  alertNotification() {
          let alert = this.alertController.create({
            title: "welcome",
            subTitle: "hi"
          });
          alert.present();
        

  }

  scheduleNotification() {
    this.localNotifications.schedule({
      id: 1,
      title: 'Attention',
      text: 'My Notification dude',
      at: new Date(new Date().getTime() + 5*1000),
      data: { mydata: 'My hidden mesage this is'}
    });
  }

  start() {
    this.speechRecognition.startListening()
    .subscribe(
        (matches: Array<string>) => {
          console.log(matches);
          this.testing = matches[0];

        }
      )
  }


  // api2() {

  // this.testing="hello"

  // let headers = {
  //           "Content-Type": "application/json"
  //       };

  // this.http.setDataSerializer('json');
  // this.http.post('http://192.168.43.10:8000/employees2/?format=json', "hello", {"Content-Type": "application/json"})
  // .then(data => {
  //   this.testing="success"
  // })
  // .catch(error => {
  //   this.testing="fail"
  // })

  // }


  api3() {


        let headers = new Headers({ "content-type": "application/json", "Accept": "application/json" });
        let options = new RequestOptions({ headers: headers });


    this.http2.post('http://192.168.43.10:8000/employees2/?format=json', JSON.stringify("hello"), options)
        .subscribe(data => {
            
            this.testing=data.json()
        }, error => {
            console.log(JSON.stringify(error.json()));
        });

  }

  // api() {
  //   this.testing="hello"

  //   this.http.get('http://192.168.43.10:8000/employees/?format=json', {}, {})
  // .then(data => {

  //   this.testing=data.data;
  //   console.log(data)
  //   console.log(data.status);
  //   console.log(data.data); // data received by server
  //   console.log(data.headers);

  // })
  // .catch(error => {

  //    console.log(error, "fail")
  //   console.log(error.status);
  //   console.log(error.error); // error message as string
  //   console.log(error.headers);

  // });

  // }

  editimage() {
    let statusalert = this.alertCtrl.create({
      buttons: ['okay']
    });
    this.imghandler.uploadimage().then((url: any) => {
      this.userservice.updateimage(url).then((res: any) => {
        if (res.success) {
          statusalert.setTitle('Updated');
          statusalert.setSubTitle('Your profile pic has been changed successfully!!');
          statusalert.present();
          this.zone.run(() => {
          this.avatar = url;
        })  
        }  
      }).catch((err) => {
          statusalert.setTitle('Failed');
          statusalert.setSubTitle('Your profile pic was not changed');
          statusalert.present();
      })
      })
  }

  editname() {
    let statusalert = this.alertCtrl.create({
      buttons: ['okay']
    });
    let alert = this.alertCtrl.create({
      title: 'Edit Nickname',
      inputs: [{
        name: 'nickname',
        placeholder: 'Nickname'
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: data => {

        }
      },
      {
        text: 'Edit',
        handler: data => {
          if (data.nickname) {
            this.userservice.updatedisplayname(data.nickname).then((res: any) => {
              if (res.success) {
                statusalert.setTitle('Updated');
                statusalert.setSubTitle('Your nickname has been changed successfully!!');
                statusalert.present();
                this.zone.run(() => {
                  this.displayName = data.nickname;
                })
              }

              else {
                statusalert.setTitle('Failed');
                statusalert.setSubTitle('Your nickname was not changed');
                statusalert.present();
              }
                             
            })
          }
        }
        
      }]
    });
    alert.present();
  }

  logout() {
    firebase.auth().signOut().then(() => {
      this.navCtrl.parent.parent.setRoot('LoginPage');
    })
  }


}