import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { LoginPage } from '../pages/login/login';
import { SettingsPage } from '../pages/settings/settings';
import { Auth } from '../providers/auth';
import { Firebase } from '../providers/firebase';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    LoginPage,
    SettingsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    FormsModule,
    ReactiveFormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    LoginPage,
    SettingsPage
  ],
  providers: [
    Firebase,
    Auth
  ]
})
export class AppModule {}
