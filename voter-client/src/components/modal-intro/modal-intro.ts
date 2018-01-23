import { Component } from '@angular/core';
import { WalletUtilsProvider } from '../../providers/wallet-utils/wallet-utils';
import { ConfigProvider } from '../../providers/config/config';
import { ViewController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';

/**
 * Generated class for the ModalIntroComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'modal-intro',
  templateUrl: 'modal-intro.html'
})
export class ModalIntroComponent {

  text: string;
  rpcUrl: string;

  constructor(
    private walletUtils: WalletUtilsProvider,
    private storage: StorageProvider,
    private config: ConfigProvider,
    private viewCtrl: ViewController
  ) {

    console.log('Hello ModalIntroComponent Component');
    this.text = 'Hello World';

  }

  async setupTap() {

    if(!this.walletUtils.validateUrl(this.rpcUrl)) return alert('Url is invalid');

    this.config.provider.url = this.rpcUrl;
    await this.storage.setRPCUrl(this.rpcUrl);
    await this.walletUtils.initWallet();

    this.viewCtrl.dismiss();

  }

}
