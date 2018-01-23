import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { KeyUtilsProvider } from '../providers/key-utils/key-utils';
import { StorageProvider } from '../providers/storage/storage';
import { ConfigProvider } from '../providers/config/config';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { WalletUtilsProvider } from '../providers/wallet-utils/wallet-utils';
import { ProfilePage } from '../pages/profile/profile';
import { ProposalsPage } from '../pages/proposals/proposals';
import { ComponentsModule } from '../components/components.module';
import { HttpProvider } from '../providers/http/http';
import { ContractsPage } from '../pages/contracts/contracts';
import { Toast } from '@ionic-native/toast';
import { Clipboard } from '@ionic-native/clipboard';

@NgModule({
  declarations: [
    MyApp,
    ProfilePage,
    ProposalsPage,
    TabsPage,
    ContractsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{
      platforms: {
        ios: {
          scrollAssist: false,
          autoFocusAssist: false
        },
        android: {
          scrollAssist: false,
          autoFocusAssist: false
        }
      }
    }),
    ComponentsModule,
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: ['indexeddb']
    }),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ProfilePage,
    ProposalsPage,
    TabsPage,
    ContractsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HttpClientModule,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    KeyUtilsProvider,
    StorageProvider,
    ConfigProvider,
    WalletUtilsProvider,
    HttpProvider,
    Toast,
    Clipboard
  ]
})
export class AppModule {}
