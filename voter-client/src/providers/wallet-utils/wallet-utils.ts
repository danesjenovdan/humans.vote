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
  async initWallet(withProvider = true) {

    const privateKey = await this.keyUtils.initKey();
    const rpcUrl = await this.storage.getRPCUrl();

    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl, {
      chainId: this.config.provider.chainId,
      name: this.config.provider.name
    });

    if (!privateKey) throw new Error('No private key when creating the wallet');

    if(withProvider) {
      this.wallet = new ethers.Wallet(privateKey, this.provider);
    }else{
      this.wallet = new ethers.Wallet(privateKey);
    }

    return this.wallet;

  }

  /**
   * Returns wallet contractAddress
   * @returns {any}
   */
  get walletAddress() {
    if (this.wallet) return this.wallet.address;
    return null;
  }

  /**
   * Check balance of a wallet with the passed contractAddress
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
  async deployContract(abi: string, bin: string, args: Array<any>) {

    try {

      // Notice we pass in "Hello World" as the parameter to the constructor
      const deployTransaction = Contract.getDeployTransaction(bin, abi, ...args);
      // Send the transaction
      const contractResponse = await this.wallet.sendTransaction(deployTransaction);

      // get transaction info
      const transactionInfo = await this.getTransaction(contractResponse.hash);

      await this.storage.addDeployedTransaction({
        hash: contractResponse.hash,
        status: TRANSACTION_STATUS.MINING,
        contractAddress: transactionInfo.creates,
        abi,
        name
      });

      // Get notified when a transaction is mined
      this.provider.once(contractResponse.hash, (transaction) => {
        this.storage.updateTransactionStatus(transaction.hash, TRANSACTION_STATUS.MINED, transaction.creates);
      });

      return contractResponse;

    } catch (err) {
      return Promise.reject(err);
    }

  }

  /**
   * Get transaction receipt. Only availabe after transaction is mined.
   * @param hash
   * @returns {Promise<any>}
   */
  async getTransactionReceipt(hash) {

    return await this.provider.getTransactionReceipt(hash);

  }

  /**
   * Get transaction from provider
   * @param hash
   * @returns {Promise<any>}
   */
  async getTransaction(hash) {

    return await this.provider.getTransaction(hash);

  }

  /**
   * Connect to contract
   * @param address
   * @param abi
   * @returns {Promise<any>}
   */
  async connectToContract(address, abi) {

    try {

      const contract = new ethers.Contract(address, abi, this.provider);
      console.log(contract);
      const result = await contract.majorityMargin();
      return result;

    } catch (err) {
      console.log(err);
    }

  }

  /**
   * Validate ethereum contractAddress
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
    return isURL(url, { require_tld: false, require_protocol:true });
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

export const TRANSACTION_STATUS = {
  MINING: 'MINING',
  MINED: 'MINED'
};
