import { Component } from '@angular/core';

import { WalletUtilsProvider } from '../../providers/wallet-utils/wallet-utils';
import { ProposalsPage } from '../proposals/proposals';
import { ProfilePage } from '../profile/profile';
import { ModalController, NavParams } from 'ionic-angular';
import { ModalIntroComponent } from '../../components/modal-intro/modal-intro';
import { StorageProvider } from '../../providers/storage/storage';
import { ConfigProvider } from '../../providers/config/config';
import { ContractsPage } from '../contracts/contracts';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ProposalsPage;
  tab2Root = ContractsPage;
  tab3Root = ProfilePage;

  constructor(private config: ConfigProvider, private walletUtils: WalletUtilsProvider, private modalCtrl: ModalController, private storage: StorageProvider) {

  }

  /**
   * Guard app from starting before wallet initialization is complete
   * @returns {Promise<boolean>}
   */
  async ionViewCanEnter() {

    return new Promise(async (resolve, reject) => {

      // check if RPC url is set
      const rpcUrl = await this.storage.getRPCUrl();

      // if it's set initialize wallet
      if (rpcUrl) {

        // this.config.genesis = await this.walletUtils.getGenesisFile();
        // await this.walletUtils.initWallet();
        // return resolve();

      }

      const initialized = await this.storage.getInitialized();

      if(!initialized){
        await this.storage.seedContracts();
      }

      await this.storage.setInitialized();

      // if it's not set open an intro modal where it needs to be entered
      let profileModal = this.modalCtrl.create(ModalIntroComponent);
      profileModal.onDidDismiss(data => {
        resolve();
      });
      profileModal.present();

    });

  }

}
