import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatAnalysisPage } from './chat-analysis';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    ChatAnalysisPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatAnalysisPage),
    ChartsModule
  ],
})
export class ChatAnalysisPageModule {}
