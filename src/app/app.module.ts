import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { config } from './app.firebaseconfig';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';

import { MyApp } from './app.component';
import { AuthProvider } from '../providers/auth/auth';
import { UserProvider } from '../providers/user/user';
import { ImghandlerProvider } from '../providers/imghandler/imghandler';

import { File } from '@ionic-native/file';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { RequestsProvider } from '../providers/requests/requests';
import { Observable } from 'rxjs/Rx';
import { ChatProvider } from '../providers/chat/chat';
import { GroupsProvider } from '../providers/groups/groups';

import { Keyboard } from '@ionic-native/keyboard';

import { HTTP } from '@ionic-native/http';
import { HttpModule } from '@angular/http';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { CallNumber } from '@ionic-native/call-number';
import { NgCalendarModule  } from 'ionic2-calendar';
import { TextToSpeech } from '@ionic-native/text-to-speech'
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { ChartsModule } from 'ng2-charts';
import { NetworkInterface } from '@ionic-native/network-interface';

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    NgCalendarModule,
    BrowserModule,
    HttpModule,
    ChartsModule,
    //IonicModule.forRoot(MyApp),
    IonicModule.forRoot(MyApp, {tabsPlacement: 'top', scrollAssist: false, autoFocusAssist: false}),
    AngularFireModule.initializeApp(config)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,

  ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    FilePath,
    FileChooser,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    AngularFireAuth,
    AuthProvider,
    UserProvider,
    ImghandlerProvider,
    RequestsProvider,
    ChatProvider,
    GroupsProvider,
    Keyboard,
    HTTP,
    SpeechRecognition,
    LocalNotifications,
    CallNumber,
    TextToSpeech,
    SpinnerDialog,
    NetworkInterface


    
  ]
})
export class AppModule {}
