import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';
import { NgCalendarModule} from 'ionic2-calendar';
import { NetworkInterface } from '@ionic-native/network-interface';

@NgModule({
  declarations: [
    ProfilePage,
  ],
  imports: [
    NgCalendarModule,
    IonicPageModule.forChild(ProfilePage),
  ],
  providers: [
  	NetworkInterface
  ]
})
export class ProfilePageModule {}
