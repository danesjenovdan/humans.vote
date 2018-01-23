import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';
import { WalletUtilsProvider } from '../../providers/wallet-utils/wallet-utils';
import { StorageProvider } from '../../providers/storage/storage';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage implements OnInit {

  rpcUrl: string;
  saving: boolean = false;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private storage: StorageProvider,
    private walletUtils: WalletUtilsProvider,
    private config: ConfigProvider
  ) {
  }

  async ngOnInit() {

    this.rpcUrl = await this.storage.getRPCUrl();

  }

  async saveRPCUrlTap() {

    this.saving = true;

    console.log('this.rpcUrl: ',this.rpcUrl);

    if(!this.walletUtils.validateUrl(this.rpcUrl)) return alert('Url is invalid');

    this.config.provider.url = this.rpcUrl;
    await this.storage.setRPCUrl(this.rpcUrl);
    await this.walletUtils.initWallet();

    this.saving = false;

  }

}
