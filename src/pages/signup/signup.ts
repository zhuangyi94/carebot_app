import { Component } from '@angular/core';
import { IonicPage, 
	NavController, 
	NavParams, 
	LoadingController,
	ToastController, 
  AlertController} from 'ionic-angular';
import { UserProvider } from "../../providers/user/user";
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SpinnerDialog } from '@ionic-native/spinner-dialog'

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  authForm: FormGroup;
  authFormExtra: FormGroup;
  isHide: boolean = true;

  constructor(public navCtrl: NavController, 
  			  public navParams: NavParams,
  			  public userservice: UserProvider,
  			  public loadingCtrl: LoadingController,
  			  public toastCtrl: ToastController,
          public formBuilder: FormBuilder,
          public spinnerDialog: SpinnerDialog,
          public alertCtrl: AlertController
  			  ) {
    this.authFormExtra = this.formBuilder.group({
        'elderlyEmail' : [null, Validators.compose([
         Validators.required, 
         Validators.minLength(5), 
         Validators.maxLength(50),
         Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
         // Validators.pattern(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i)])],
      ])],

        'elderlyCode' : [null, Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(5)
          ])],

    });

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

         ])],

       'displayName' : [null, Validators.compose([
         Validators.required,
         Validators.minLength(1),
         Validators.maxLength(50)

         ])],

    });    
  }

  ionViewWillEnter(){
    if(this.navParams.data.isElderly==false){
      this.isHide=false
    }
  }

  signup() {

    var toaster = this.toastCtrl.create({
    	duration: 3000,
    	position: 'bottom'
    });

    var alert = this.alertCtrl.create({
    })

    if(this.authForm.valid && this.isHide){
      console.log("valid",this.authForm.value);
      this.spinnerDialog.show();
      this.userservice.adduser(this.authForm.value).then((res: any) => {
        console.log(res)
        this.spinnerDialog.hide();
        if(res.success)
          this.navCtrl.push('ProfilepicPage');
        else if(res.code=="auth/email-already-in-use"){
          alert.setTitle("Signup Error"),
          alert.setSubTitle("The email address is already in use by another account.")  
          alert.present();
        }
        else{
          //alert('Error' + res);

        }
      })       

    }else if(this.authForm.valid && this.authFormExtra.valid && !this.isHide){

      console.log("valid extra")
      let enableSignup = true;
      let extraForm = {
        email: this.authForm.value.email,
        password: this.authForm.value.password,
        displayName: this.authForm.value.displayName,
        elderlyEmail: this.authFormExtra.value.elderlyEmail,
        code: this.authFormExtra.value.elderlyCode
      }

      this.spinnerDialog.show();
      this.userservice.checkEmail(extraForm).then((response: any) => {
        console.log("response",response.code,response)
        this.spinnerDialog.hide();
        if(response.code=="auth/email-already-in-use"){
          enableSignup=true;
        }
        if(response.code=="auth/user-not-found"){
          enableSignup=false;
        }
      }).then(()=>{

      console.log("enablesignup",enableSignup)
      if(enableSignup==true){
        this.userservice.checkCode(extraForm).then((response: any) =>{
          if(response==true){
            console.log("password true")
            this.spinnerDialog.show();
            this.userservice.adduser(extraForm).then((res: any) => {
              console.log(res)
              this.spinnerDialog.hide();
              if(res.success)
                this.navCtrl.push('ProfilepicPage');
              else if(res.code=="auth/email-already-in-use"){
                alert.setTitle("Signup Error"),
                alert.setSubTitle("The email address is already in use by another account.")  
                alert.present();
              }
              else{
                //alert('Error' + res);

              }
            }) 
          }else{
            console.log("wrong password")
            toaster.setMessage("Wrong code")
            toaster.present()
          }
        }) 
      }
      else{
        toaster.setMessage("User not found")
        toaster.present()
      }

      })

 


    }
    else{
      console.log("invalid",this.authForm);
      let control_email = this.authForm.controls['email']
      let control_password = this.authForm.controls['password']
      let control_displayName = this.authForm.controls['displayName']
      let control_elderlyEmail = this.authFormExtra.controls['elderlyEmail']
      let control_elderlyCode = this.authFormExtra.controls['elderlyCode']

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
          toaster.setMessage('your password length too short.');
          toaster.present();
        }        
      }
      else if(!control_displayName.valid){
        console.log("here")
        if(control_displayName.errors['required']){
          toaster.setMessage('Please fill display name before summit.')
          toaster.present();          
        }
        else if(control_displayName.errors['maxlength']){
          toaster.setMessage('your display name length too long.');
          toaster.present();
        }
        else if(control_displayName.errors['minlength']){
          console.log("im here")
          toaster.setMessage('your display name length too short.');
          toaster.present();
        } 
      }
      else if(!control_elderlyEmail.valid){
        console.log("invalid control of elderly email")
        if(control_elderlyEmail.errors['required']){
          toaster.setMessage('Please fill email address before submit.');
          toaster.present();
        }
        else if(control_elderlyEmail.errors['pattern']){
          toaster.setMessage('Invalid email address.');
          toaster.present();
        }         
      }
      else if(!control_elderlyCode.valid){
        console.log("invalid control of elderly email")
        if(control_elderlyCode.errors['required']){
          toaster.setMessage('Please fill Invitation Code.');
          toaster.present();
        }
        else if(control_elderlyCode.errors['maxlength']){
          toaster.setMessage('Code length too long.');
          toaster.present();
        }
        else if(control_elderlyCode.errors['minlength']){
          console.log("im here")
          toaster.setMessage('Code length too short.');
          toaster.present();
        }        
      }
    }
  }

  goback() { 
  	this.navCtrl.pop()
  }

}
