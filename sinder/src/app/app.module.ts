import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

// pages
import { AboutPage } from '../pages/about/about';
import { LoginPage } from '../pages/login/login';
import { TeamsPage } from '../pages/teams/teams';
import { SettingsPage } from '../pages/settings/settings';

// providers
import { Auth } from '../providers/auth';
import { Firebase } from '../providers/firebase';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    LoginPage,
    SettingsPage,
    TeamsPage
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
    SettingsPage,
    TeamsPage
  ],
  providers: [
    Firebase,
    Auth
  ]
})
export class AppModule {}
