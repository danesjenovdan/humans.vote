import { Injectable } from '@angular/core';
import * as ethers from 'ethers';
import { ConfigProvider } from '../../providers/config/config';
import { StorageProvider } from '../storage/storage';
import { KeyUtilsProvider } from '../key-utils/key-utils';
import * as ethereum_address from 'ethereum-address';
import isURL from 'validator/lib/isURL';

const Contract = ethers.Contract;

/*
  Generated class for the WalletUtilsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WalletUtilsProvider {

  public provider;
  public wallet;

  constructor(private config: ConfigProvider, private storage: StorageProvider, private keyUtils: KeyUtilsProvider) {

  }

  /**
   * Initialize wallet
   * @returns {Promise<boolean>}
   */
  async initWallet() {

    const privateKey = await this.keyUtils.initKey();
    const rpcUrl = await this.storage.getRPCUrl();

    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl, {
      chainId: this.config.provider.chainId,
      name: this.config.provider.name
    });

    if (!privateKey) throw new Error('No private key when creating the wallet');

    this.wallet = new ethers.Wallet(privateKey, this.provider);

    return this.wallet;

  }

  /**
   * Returns wallet address
   * @returns {any}
   */
  get walletAddress() {
    if (this.wallet) return this.wallet.address;
    return null;
  }

  /**
   * Check balance of a wallet with the passed address
   * @param address
   * @returns {Promise<any>}
   */
  checkAddressBalance(address): Promise<any> {
    return this.provider.getBalance(address).then(balance => ethers.utils.formatEther(balance));
  }

  /**
   * Check my wallet balance
   * @returns {Promise<any>}
   */
  checkMyWalletBalance(): Promise<any> {
    return this.wallet.getBalance().then(balance => ethers.utils.formatEther(balance));
  }

  /**
   * Send transaction with passed transaction details
   * @param {ITransaction} transaction
   * @returns {Promise<any>}
   */
  sendTransaction(transaction: ITransaction) {
    return this.wallet.sendTransaction(transaction);
  }

  /**
   * Deploy contract
   * @param {string} abi
   * @param {string} bin
   * @param {string} name
   * @returns {Promise<any>}
   */
  async deployContract(abi: string, bin: string, name: string) {

    // Notice we pass in "Hello World" as the parameter to the constructor
    try {
      const deployTransaction = Contract.getDeployTransaction(bin, abi, "Hello World");
      // Send the transaction
      const contractResponse = await this.wallet.sendTransaction(deployTransaction);
      await this.storage.addDeployedContract({
        hash: contractResponse.hash,
        abi,
        name
      });
      console.log(contractResponse);
      return contractResponse;
    } catch (err) {
      return Promise.reject(err);
    }

  }

  async connectToContract(address, abi){

    try {

      const contract = new ethers.Contract(address, abi, this.provider);

      console.log(contract);

      const result = await contract.greet();

      console.log(result);

    }catch(err){
      console.log(err);
    }

  }

  /**
   * Validate ethereum address
   * @param {string} address
   * @returns {any}
   */
  validateAddress(address: string) {
    return ethereum_address.isAddress(address);
  }

  /**
   * Validate RPC url
   * @param {string} url
   */
  validateUrl(url: string) {
    return isURL(url, { require_tld: false });
  }

}

export interface ITransaction {

  nonce?: number;
  gasLimit: number;
  gasPrice: number;
  to: string;
  value: number;
  chainId?: number;

}
