import { Component, OnInit } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as ethers from 'ethers';
import { TabsPage } from '../pages/tabs/tabs';
import { StorageProvider } from '../providers/storage/storage';
import { KeyUtilsProvider } from '../providers/key-utils/key-utils';
import { WalletUtilsProvider } from '../providers/wallet-utils/wallet-utils';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any = TabsPage;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private storage: StorageProvider,
    private keyUtils: KeyUtilsProvider,
    private walletUtils: WalletUtilsProvider
  ) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

  }

  async initKey() {

    // Check if private key is set
    let privateKey = await this.storage.getPrivateKey();

    console.log('privateKey: ', privateKey);

    if (privateKey) return;

    privateKey = await this.keyUtils.generatePrivateKey();
    await this.storage.setPrivateKey(privateKey);

  }

}
