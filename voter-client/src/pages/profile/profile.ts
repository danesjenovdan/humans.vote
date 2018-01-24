import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';
import { WalletUtilsProvider } from '../../providers/wallet-utils/wallet-utils';
import { StorageProvider } from '../../providers/storage/storage';
import { Toast } from '@ionic-native/toast';
import { Clipboard } from '@ionic-native/clipboard';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage implements OnInit {

  rpcUrl: string;
  saving: boolean = false;
  address: string;
  balance: string = '0.0';

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private storage: StorageProvider,
    private walletUtils: WalletUtilsProvider,
    private config: ConfigProvider,
    private clipboard: Clipboard,
    private toast: Toast,
    private platform: Platform
  ) {
  }

  async ngOnInit() {

    try {
      this.address = this.walletUtils.walletAddress;
      this.rpcUrl = await this.storage.getRPCUrl();
      this.balance = await this.walletUtils.checkMyWalletBalance();
    }catch(err){
      alert('Check your RPC url please. It seems to be wrong.');
    }

  }

  /**
   * [TAP] Check balance on my wallet
   * @returns {Promise<void>}
   */
  async checkMyBalanceTap() {

    try {
      this.balance = await this.walletUtils.checkMyWalletBalance();
    } catch (err) {
      alert('Trouble accessing RPC');
    }

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

  onAddressTap(){

    this.clipboard.copy(this.address);

    if(this.platform.is('mobile')) {
      this.toast.show(`Wallet address copied to clipboard`, '3000', 'bottom').subscribe(
        toast => {
          console.log(toast);
        }
      );
    }

  }

}
