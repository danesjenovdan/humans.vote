import { Component } from '@angular/core';
import { WalletUtilsProvider } from '../../providers/wallet-utils/wallet-utils';
import { HttpProvider } from '../../providers/http/http';
import { ConfigProvider } from '../../providers/config/config';
import { ModalController, NavParams, ViewController } from 'ionic-angular';
import { includes, startCase } from 'lodash';
import { ModalContractFunctionViewComponent } from '../modal-contract-function-view/modal-contract-function-view';

/**
 * Generated class for the ModalContractViewComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'modal-contract-view',
  templateUrl: 'modal-contract-view.html'
})
export class ModalContractViewComponent {

  contract: IContract;
  setters: Array<any>;
  getters: Array<any>;
  contractName: string;

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    private config: ConfigProvider,
    private httpProvider: HttpProvider,
    private walletUtils: WalletUtilsProvider,
    public modalCtrl: ModalController
  ) {

    const setters = this.params.get('abi')
      .filter(item => item.type === 'function' && item.constant === false)
      .map(field => ({
        name: startCase(field.name),
        functionName: field.name,
        type: includes(field.type, 'int') ? 'number' : 'text',
        value: '',
        field,
        setter: true
      }));

    const getters = this.params.get('abi')
      .filter(item => item.type === 'function' && item.constant === true)
      .map(field => ({
        name: startCase(field.name),
        type: includes(field.type, 'int') ? 'number' : 'text',
        value: '',
        functionName: field.name,
        field,
        getter: true
      }));

    this.contract = this.params.get('contract');
    this.setters = setters;
    this.getters = getters;
    this.contractName = startCase(this.contract.name);

    console.log(this.contract);

  }

  onSetterSelected(item) {

    const modal = this.modalCtrl.create(ModalContractFunctionViewComponent, { abiItem: item, contract: this.contract });
    modal.onDidDismiss(data => {

    });
    modal.present();

  }

  async onGetterSelected(item) {

    // console.log('item: ', item);
    //
    // const result = await this.walletUtils.connectToContract(this.contract.contractAddress, this.contract.abi, item.functionName);
    // console.log(result);
    // alert(result);


    const modal = this.modalCtrl.create(ModalContractFunctionViewComponent, { abiItem: item, contract: this.contract });
    modal.onDidDismiss(data => {
      if(data){
        alert(data);
      }
    });
    modal.present();

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}

export interface IContract {

  abi: string;
  contractAddress: string;
  hash: string;
  name: string;
  status: string;

}