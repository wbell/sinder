import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

// pages
import { AboutPage } from '../pages/about/about';
import { LoginPage } from '../pages/login/login';
import { TeamsPage } from '../pages/teams/teams';
import { TeamBuilderPage } from '../pages/team-builder/team-builder';
import { SettingsPage } from '../pages/settings/settings';

// providers
import { Auth } from '../providers/auth';
import { Firebase } from '../providers/firebase';

// pipes
import { KeysPipe } from '../pipes/keys';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    LoginPage,
    SettingsPage,
    TeamsPage,
    TeamBuilderPage,
    KeysPipe
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
    TeamsPage,
    TeamBuilderPage
  ],
  providers: [
    Firebase,
    Auth
  ]
})
export class AppModule {}
