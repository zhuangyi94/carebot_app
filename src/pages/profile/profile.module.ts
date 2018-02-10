import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';
import { NgCalendarModule} from 'ionic2-calendar';

@NgModule({
  declarations: [
    ProfilePage,
  ],
  imports: [
    NgCalendarModule,
    IonicPageModule.forChild(ProfilePage),
  ],
})
export class ProfilePageModule {}
