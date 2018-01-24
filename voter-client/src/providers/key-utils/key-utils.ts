import { Injectable } from '@angular/core';
import * as ethers from 'ethers';
import * as keythereum from 'keythereum';
import { StorageProvider } from '../storage/storage';

const utils = ethers.utils;

/*
  Generated class for the KeyUtilsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class KeyUtilsProvider {

  keyParams: IKeyParams = { keyBytes: 32, ivBytes: 16 };

  constructor(private storage: StorageProvider) {
  }

  /**
   * Initialise private key
   * if the key exists reuse otherwise generate a new hex key and store it
   * @returns {Promise<any>}
   */
  async initKey() {

    // Check if private key is set
    let privateKey = await this.storage.getPrivateKey();

    console.log('privateKey: ',privateKey);

    if (privateKey) return privateKey;

    privateKey = await this.generatePrivateKey();
    await this.storage.setPrivateKey(privateKey);

    return privateKey;

  }

  /**
   * Generate the private key as a hex value
   * @returns {string}
   */
  generatePrivateKey() {

    const dk = keythereum.create(this.keyParams);
    return '0x' + dk.privateKey.toString('hex');

  }

}

export interface IKeyParams {
  keyBytes: number;
  ivBytes: number;
}