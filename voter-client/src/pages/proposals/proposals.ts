import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as ethers from 'ethers';
import * as keythereum from 'keythereum';
import { WalletUtilsProvider } from '../../providers/wallet-utils/wallet-utils';

const utils = ethers.utils;

@Component({
  selector: 'page-proposals',
  templateUrl: 'proposals.html',
})
export class ProposalsPage implements OnInit {
  wallet;
  provider;
  address;
  balanceCheckAddress;
  balance: string = '0.0';
  ethers: string = '0.0';
  recipientAddress: string;
  addressBalance: string;

  constructor(
    private walletUtils: WalletUtilsProvider
  ) {

  }

  ngOnInit() {

    this.provider = this.walletUtils.provider;
    this.wallet = this.walletUtils.wallet;
    this.address = this.walletUtils.walletAddress;

  }

  async checkAddressBalanceTap() {

    if (!this.walletUtils.validateAddress(this.balanceCheckAddress)) return alert('Invalid ethereum address');

    try {
      this.addressBalance = await this.walletUtils.checkAddressBalance(this.balanceCheckAddress);
    } catch (err) {
      console.log(err);
      alert('Trouble accessing RPC');
    }

  }

  async checkMyBalanceTap() {

    try {
      this.balance = await this.walletUtils.checkMyWalletBalance();
    } catch (err) {
      alert('Trouble accessing RPC');
    }

  }

  async sendEthTap() {

    if (!this.walletUtils.validateAddress(this.recipientAddress)) return alert('Invalid ethereum address');
    try {
      const transactionResult = await this.walletUtils.sendTransaction({
        //nonce: 1,
        gasLimit: 21000,
        gasPrice: utils.bigNumberify('20000000000'),
        to: this.recipientAddress,
        value: utils.parseEther('1.0'),
        chainId: 9999
      });
      console.log(transactionResult);
    } catch (err) {
      alert('Trouble accessing RPC');
    }

  }


}
