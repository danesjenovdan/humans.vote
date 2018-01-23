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

  /**
   *
   * @returns {Promise<Array<ITransaction>>}
   */
  async getDeployedTransactions(): Promise<Array<ITransaction>> {

    return await this.storage.get('contracts') || [] as ITransaction[];

  }

  /**
   * Add deployed transaction
   * @param {ITransaction} contract
   * @returns {Promise<any>}
   */
  async addDeployedTransaction(contract: ITransaction) {

    let contracts = await this.storage.get('contracts');

    if (!contracts) contracts = [];

    contracts.push(contract);

    console.log(contracts);

    return this.storage.set('contracts', contracts);

  }

  /**
   * Update transaction status
   * @param {string} hash
   * @param {string} status
   * @param {string} address
   * @returns {Promise<any>}
   */
  async updateTransactionStatus(hash: string, status: string, address: string) {

    const contracts = await this.getDeployedTransactions();

    const contract = contracts.filter(contract => contract.hash === hash)[0];

    if (!contract) return null;

    if(status) {
      contract.status = status;
    }
    contract.contractAddress = address;

    return this.storage.set('contracts', contracts);

  }

  /**
   * Remove transaction reference from local storage
   * @param hash
   * @returns {Promise<any>}
   */
  async removeDeployedTransaction(hash) {

    const contracts = await this.getDeployedTransactions();

    contracts.forEach((contract,i) => {
      if(contract.hash === hash) contracts.splice(i,1);
    });

    return this.storage.set('contracts', contracts);

  }

}

export interface ITransaction {

  status: string;
  name: string;
  abi: string;
  hash: string;
  contractAddress?: string;

}