import { Component, OnInit } from '@angular/core';
import { WalletUtilsProvider } from '../../providers/wallet-utils/wallet-utils';
import { ConfigProvider } from '../../providers/config/config';
import { Platform, ViewController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { Clipboard } from '@ionic-native/clipboard';
import { Toast } from '@ionic-native/toast';

@Component({
  selector: 'modal-intro',
  templateUrl: 'modal-intro.html'
})
export class ModalIntroComponent implements OnInit {

  text: string;
  rpcUrl: string = 'http://chain.humans.vote';
  port: number;
  address: string;
  page: string = 'WALLET';
  isAdmin = false;
  demoWallet = true;
  enableDemoWallet = true;


  constructor(
    private walletUtils: WalletUtilsProvider,
    private storage: StorageProvider,
    private config: ConfigProvider,
    private viewCtrl: ViewController,
    private clipboard: Clipboard,
    private toast: Toast,
    private platform: Platform
  ) {

    console.log('Hello ModalIntroComponent Component');
    this.text = 'Hello World';

  }

  async ngOnInit() {

    const rpcUrlFromStorage = await this.storage.getRPCUrl();

    if (rpcUrlFromStorage) {
      const parts = rpcUrlFromStorage.split(':');
      this.rpcUrl = parts[0] + ':' + parts[1] || 'http://chain.humans.vote';
    }

    if (this.rpcUrl === 'http://chain.humans.vote') {
      this.enableDemoWallet = true;
    }

    const wallet = await this.walletUtils.initWallet(false);
    this.address = wallet.address;
    this.port = this.config.port;

  }

  onChange() {

    if (this.rpcUrl === 'http://chain.humans.vote') {
      this.enableDemoWallet = true;
    } else {
      this.demoWallet = false;
      this.enableDemoWallet = false;
    }

  }


  /**
   * [TAP] On address tap
   */
  onAddressTap() {

    this.clipboard.copy(this.address);

    if (this.platform.is('mobile')) {
      this.toast.show(`Wallet address copied to clipboard`, '3000', 'bottom').subscribe(
        toast => {
          console.log(toast);
        }
      );
    }

  }

  /**
   * [TAP] Wallet done
   * @param isAdmin
   */
  walletDoneTap(isAdmin) {

    this.page = isAdmin ? 'ADMIN' : 'URL';
    this.isAdmin = isAdmin;

  }

  /**
   * [TAP] Admin done
   */
  adminDoneTap() {

    this.page = 'URL';

  }

  /**
   * [TAP] RPC url done tap
   */
  async rpcDoneTap() {

    if (!this.walletUtils.validateUrl(this.rpcUrl)) return alert('Url is invalid');

    console.log('+this.port: ', this.port);

    // todo - confirm that this wallet is owner of a contract there?

    this.config.provider.url = this.rpcUrl + ':' + this.port;
    await this.storage.setRPCUrl(this.rpcUrl + ':' + this.port);
    await this.walletUtils.initWallet(true, this.demoWallet ? this.config.demoWalletKey : false);

    this.page = 'DONE';

  }

  /**
   * [TAP] End done tap
   */
  endTap() {
    this.viewCtrl.dismiss();
  }

}
