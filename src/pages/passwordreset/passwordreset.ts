import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-passwordreset',
  templateUrl: 'passwordreset.html',
})
export class PasswordresetPage {

	email: string;
  authForm: FormGroup;
  submitAttempt: boolean = false;
  invalidForm: boolean = false;


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public alertCtrl: AlertController, 
    public userservice: UserProvider, 
    public formBuilder: FormBuilder,
    public toastCtrl: ToastController) {

    this.authForm = this.formBuilder.group({
       'email' : [null, Validators.compose(
         [Validators.required, 
         Validators.minLength(5), 
         Validators.maxLength(50),
         Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
         // Validators.pattern(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i)])],
      ])]
    });
  }

  ionViewDidLoad() {
   
  }


  reset() {

    this.submitAttempt = true;
    let alert = this.alertCtrl.create({
      buttons: ['Ok']
    });

    if(this.authForm.valid){
      console.log("it is valid")
      this.invalidForm = false;
      this.userservice.passwordreset(this.email).then((res: any) => {
        console.log(res)
        if (res.success) {
          alert.setTitle('Email Sent');
          alert.setSubTitle('Please follow the instructions in the email to reset your password');
        }
        else {
          if(res.message=="The email address is badly formatted")
          {
            alert.setTitle('Invalid email')
            alert.setSubTitle('Invalid email format. Please try enter again with a valid email')
          }
        }
      })

    }
    else{
      console.log("this is not valid")
      let toaster = this.toastCtrl.create({
        duration: 3000,
        position: 'bottom'
      });

      this.invalidForm = true;
      let control = this.authForm.controls['email']
      if(!control.valid){
        console.log("invalid control")
        if(control.errors['required']){
          toaster.setMessage('Please fill email address before submit.');
          toaster.present();
        }
        else if(control.errors['pattern']){
          toaster.setMessage('Invalid email address.');
          toaster.present();
        }
      }

    }
  }

  goback() {
  	this.navCtrl.pop();
  }

}
