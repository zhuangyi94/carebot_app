import { Component } from '@angular/core';
import { IonicPage, 
  NavController, 
  NavParams, 
  ToastController,
  LoadingController } from 'ionic-angular';
import { usercreds } from '../../models/interfaces/usercreds';
import { AuthProvider } from '../../providers/auth/auth';
import { AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SpinnerDialog } from '@ionic-native/spinner-dialog'


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  splash =true;
  alert = [];
  credentials = {} as usercreds; //delete ltr,unused
  authForm: FormGroup;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public authservice: AuthProvider,
    public alertController: AlertController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public formBuilder: FormBuilder,
    public spinnerDialog: SpinnerDialog) {

    this.authForm = this.formBuilder.group({
       'email' : [null, Validators.compose([
         Validators.required, 
         Validators.minLength(5), 
         Validators.maxLength(50),
         Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
         // Validators.pattern(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i)])],
      ])],

       'password' : [null, Validators.compose([
         Validators.required,
         Validators.minLength(5),
         Validators.maxLength(10)

         ])]
    });

  }
 
  ionViewDidLoad() {
    setTimeout( () => this.splash = false, 2000 );
    console.log('ionViewDidLoad LoginPage');
  }
 
  signin() {

    var toaster = this.toastController.create({
      duration: 3000,
      position: 'bottom'
    });

    // let loader =  this.loadingController.create({
    //   content: 'Please wait'
    // })

    if(this.authForm.valid){
      console.log(this.authForm.value)

      this.spinnerDialog.show() 
      // loader.present()
      this.authservice.login(this.authForm.value).then((res: any) => {
      this.spinnerDialog.hide()
      //loader.dismiss();
      console.log(res)
      if (res!=true){
        let alert = this.alertController.create({
            title: 'Login Failed',
            subTitle: 'We do not recognize your username and/or password. Please try again.',
            buttons: ['Ok']
        });
        alert.present()
       } 
      else
        this.navCtrl.setRoot('TabsPage');
    })
      
    }else{
      console.log("invalid");

      let control_email = this.authForm.controls['email']
      let control_password = this.authForm.controls['password']

      // if(!control_email.valid && !control_password.valid){
      //   toaster.setMessage('Invalid email and password.')
      //   toaster.present();
      // }
     if(!control_email.valid){
        console.log("invalid control of email")
        if(control_email.errors['required']){
          toaster.setMessage('Please fill email address before submit.');
          toaster.present();
        }
        else if(control_email.errors['pattern']){
          toaster.setMessage('Invalid email address.');
          toaster.present();
        }
      }
      else if(!control_password.valid){
        console.log("invalid control of password",control_password)
        if(control_password.errors['required']){
          toaster.setMessage('Please fill password before summit.')
          toaster.present();
        }
        else if(control_password.errors['maxlength']){
          toaster.setMessage('your password length too long.');
          toaster.present();
        }
        else if(control_password.errors['minlength']){
          console.log("im here")
          toaster.setMessage('your password length too short.');
          toaster.present();
        }        
      }
      else{

      }
    }

    // if(!this.credentials.email&&!this.credentials.password || !this.credentials.email || !this.credentials.password){
    //     toaster.setMessage('All field required dude');
    //     toaster.present();
    // }
    // else{

      

    // });

    // loader.present();
    //   this.authservice.login(this.credentials).then((res: any) => {
    //   //loader.dismiss();
    //   console.log(res)
    //   if (res!=true){
    //     let alert = this.alertController.create({
    //         title: 'Login Failed',
    //         subTitle: 'We do not recognize your username and/or password. Please try again.',
    //         buttons: ['Ok']
    //     });
    //     alert.present()
    //    } 
    //   else
    //     this.navCtrl.setRoot('TabsPage');
    // })

    //}


  }
 
  passwordreset() {
    this.navCtrl.push('PasswordresetPage');
  }
   
  signup() {
    this.navCtrl.push('RolePage');
  }
 
}