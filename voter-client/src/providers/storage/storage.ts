import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/*
  Generated class for the StorageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StorageProvider {

  constructor(private storage: Storage) {
  }

  /**
   * Save private key to local storage
   * @returns {Promise<any>}
   */
  setPrivateKey(key) {
    this.storage.set('privateKey', key);
  }

  /**
   * Set RPC url
   * @param url
   */
  setRPCUrl(url) {
    return this.storage.set('rpcUrl', url);
  }

  /**
   * Get RPC url
   * @param url
   */
  getRPCUrl() {
    return this.storage.get('rpcUrl');
  }

  /**
   * Get private key from local storage
   * @returns {Promise<any>}
   */
  getPrivateKey(): Promise<any> {
    return this.storage.get('privateKey');
  }

  async getDeployedContracts(): Promise<Array<IContract>> {

    return await this.storage.get('contracts') as IContract[];

  }

  async addDeployedContract(contract: IContract) {

    let contracts = await this.storage.get('contracts');

    if (!contracts) contracts = [];

    contracts.push(contract);

    return this.storage.set('contracts', contracts);

  }

  removeDeployedContract() {

  }

}

export interface IContract {

  name: string;
  abi: string;
  hash: string;

}