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
  rpcUrl: string = 'http://51.15.206.108';
  port: number;
  address: string;
  page: string = 'WALLET';
  isAdmin = false;

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

    const wallet = await this.walletUtils.initWallet(false);
    this.address = wallet.address;
    this.port = this.config.port;

  }

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

  walletDoneTap(isAdmin) {

    this.page = isAdmin?'ADMIN':'URL';
    this.isAdmin = isAdmin;

  }

  adminDoneTap(){

    this.page = 'URL';

  }

  async rpcDoneTap() {

    if (!this.walletUtils.validateUrl(this.rpcUrl)) return alert('Url is invalid');

    console.log('+this.port: ',this.port);

    // todo - confirm that this wallet is owner of a contract there?

    this.config.provider.url = this.rpcUrl+':'+this.port;
    await this.storage.setRPCUrl(this.rpcUrl+':'+this.port);
    await this.walletUtils.initWallet();

    this.page = 'DONE';

  }

  endTap() {
    this.viewCtrl.dismiss();
  }

}
