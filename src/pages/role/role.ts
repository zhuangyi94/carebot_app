import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-role',
  templateUrl: 'role.html',
})
export class RolePage {

	isElderly: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RolePage');
  }

	setRoleUser(){

		this.isElderly = true;
		this.navCtrl.push('SignupPage', {
			isElderly: true
		})

	}

	setRoleGuardian(){

		this.isElderly = false;
		this.navCtrl.push('SignupPage', {
			isElderly: false
		})

	}

	// swipe(event){
	// 	if(event.direction === 2){
	// 		console.log("left!!!")
	// 		this.isElderly = true;
	// 	}

	// 	if(event.direction === 4){
	// 		console.log("right!!!")
	// 		this.isElderly = false;
	// 	}
	// }


}
