import { Component } from '@angular/core';
import { IonicPage, 
  NavController, 
  NavParams, 
  ToastController,
  LoadingController } from 'ionic-angular';
import { usercreds } from '../../models/interfaces/usercreds';
import { AuthProvider } from '../../providers/auth/auth';
import { AlertController } from 'ionic-angular';
 
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  alert = [];
  credentials = {} as usercreds;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public authservice: AuthProvider,
    public alertController: AlertController,
    public toastController: ToastController,
    public loadingController: LoadingController) {
  }
 
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
 
  signin() {

    var toaster = this.toastController.create({
      duration: 3000,
      position: 'bottom'
    });

    if(!this.credentials.email&&!this.credentials.password || !this.credentials.email || !this.credentials.password){
        toaster.setMessage('All field required dude');
        toaster.present();
    }
    else{

      let loader =  this.loadingController.create({
      content: 'Please wait'

    });

    loader.present();
      this.authservice.login(this.credentials).then((res: any) => {
      loader.dismiss();
      console.log(res)
      if (res.code){
        let alert = this.alertController.create({
            title: 'Login Failed',
            subTitle: 'We do not recognize your username and/or password. Please try again.',
            buttons: ['Ok']
        });
       } 
      else
        this.navCtrl.setRoot('TabsPage');
    })

    }


  }
 
  passwordreset() {
    this.navCtrl.push('PasswordresetPage');
  }
   
  signup() {
    this.navCtrl.push('SignupPage');
  }
 
}