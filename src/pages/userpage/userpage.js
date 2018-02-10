import {Page, NavController, Alert} from 'ionic-angular';
import {AuthService} from '../home/authservice';
import {HomePage} from '../home/home';

@Page({
    templateUrl: 'build/pages/userpage/userpage.html',
    providers: [AuthService]
})

export class UserPage {
    static get parameters() {
        return [[AuthService],[NavController]];
    }
    constructor(authservice, navcontroller) {
        this.service = authservice;
        this.nav = navcontroller;
        
    }
    
    logout() {
        this.service.logout();
        this.nav.setRoot(HomePage);
    }
    
    getinfo() {
        this.service.getinfo().then(data => {
        if(data.success) {
            var alert = Alert.create({
                title: data.success,
                subTitle: data.msg,
                buttons: ['ok']
            });
            this.nav.present(alert);
        }
            
    })
                                    
}
}