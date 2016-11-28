import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { LoginPage } from '../pages/login/login';
import { SettingsPage } from '../pages/settings/settings';
import { Auth } from '../providers/auth';
import { Firebase } from '../providers/firebase';

@NgModule({
  declarations: [
    MyApp,
    Page1,
    Page2,
    LoginPage,
    SettingsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Page2,
    LoginPage,
    SettingsPage
  ],
  providers: [
    Firebase,
    Auth
  ]
})
export class AppModule {}
