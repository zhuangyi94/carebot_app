import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalendarviewPage } from './calendarview';
import { NgCalendarModule} from 'ionic2-calendar';

@NgModule({
  declarations: [
    CalendarviewPage
  ],
  imports: [
    IonicPageModule.forChild(CalendarviewPage),
    NgCalendarModule,
    
  ],
})
export class CalendarviewPageModule {}
