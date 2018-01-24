import { Component } from '@angular/core';
import { LoadingController, ModalController, NavParams, ViewController } from 'ionic-angular';
import { WalletUtilsProvider } from '../../providers/wallet-utils/wallet-utils';
import { HttpProvider } from '../../providers/http/http';
import { ConfigProvider } from '../../providers/config/config';
import { IContract } from '../modal-contract-view/modal-contract-view';
import { includes, startCase } from 'lodash';
import * as InputDataDecoder from 'ethereum-input-data-decoder';
import * as abiDecoder from 'abi-decoder';

declare var cordova;

@Component({
  selector: 'modal-contract-function-view',
  templateUrl: 'modal-contract-function-view.html'
})
export class ModalContractFunctionViewComponent {

  title: string;
  contract: IContract;
  abiItem: any;
  inputs: IAIBMethodInput[];
  submitting: boolean = false;

  constructor(
    private params: NavParams,
    private viewCtrl: ViewController,
    private config: ConfigProvider,
    private httpProvider: HttpProvider,
    private walletUtils: WalletUtilsProvider,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController
  ) {

    this.contract = this.params.get('contract');
    this.abiItem = this.params.get('abiItem');

    console.log(this.abiItem);
    this.title = this.abiItem.name;

    const inputs = this.abiItem.field.inputs || [];

    this.inputs = inputs.map(item => ({
      name: startCase(item.name),
      functionName: item.name,
      type: item.type
    }));

  }

  dismiss(attr = null) {
    this.viewCtrl.dismiss(attr);
  }

  async submit() {

    const missingFields = this.inputs.filter(input => !input.value);

    if (missingFields.length) return alert('Some fields are empty');

    let attributes = this.inputs.map(input => input.value) as any[];

//    attributes = attributes.map(arg => !isNaN(arg) ? Number(arg) : arg) as any[];

    console.log('this.contract.contractAddress: ', this.contract.contractAddress);
    console.log('this.contract.abi: ', this.contract.abi);
    console.log('this.abiItem.functionName: ', this.abiItem.functionName);
    console.log('attributes: ', attributes);

    this.submitting = true;
    const contractResult = await this.walletUtils.connectToContract(this.contract.contractAddress, this.contract.abi, this.abiItem.functionName, attributes);

    let loading = this.loadingCtrl.create({
      content: 'Please wait... (mining)'
    });
    loading.present();

    if (this.abiItem.setter) {

      console.log('contractResult: ', contractResult);
      const transactionHash = contractResult.hash;

      // Get notified when a transaction is mined
      this.walletUtils.provider.once(transactionHash, (transaction) => {

        const data = transaction.data.slice(2);

        this.submitting = false;
        console.log('transaction: ', transaction);
        console.log('data: ', data);
        loading.dismiss();
        this.dismiss();

      });

    } else {
      loading.dismiss();
      this.dismiss(contractResult);
    }

  }

  scanQr(field) {

    console.log('field: ', field);

    cordova.plugins.barcodeScanner.scan(
      (result) => {
        //if(!this.walletUtils.validateAddress(result.text)) return alert('Not a valid 0x address');
        field.value = result.text.slice(2);
        console.log(field.value);
      },
      (error) => {
        alert("Scanning failed: " + error);
      },
      {
        preferFrontCamera: false, // iOS and Android
        showFlipCameraButton: false, // iOS and Android
        showTorchButton: false, // iOS and Android
        torchOn: false, // Android, launch with the torch switched on (if available)
        saveHistory: true, // Android, save scan history (default false)
        prompt: "Place a QR inside the scan area", // Android
        resultDisplayDuration: 100, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
        formats: "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
        orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
        disableAnimations: true, // iOS
        disableSuccessBeep: true // iOS and Android
      }
    );

  }

}

export interface IAIBMethodInput {
  name: string;
  type: string;
  functionName: string;
  value?: string;
}