import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { ConfigProvider } from '../../providers/config/config';
import { TRANSACTION_STATUS, WalletUtilsProvider } from '../../providers/wallet-utils/wallet-utils';
import { ITransaction, StorageProvider } from '../../providers/storage/storage';


@Component({
  selector: 'page-contracts',
  templateUrl: 'contracts.html',
})
export class ContractsPage implements OnInit {

  contracts: any = [];
  loading: boolean = false;
  page: string = 'active';
  deployedContracts: ITransaction[] = [];

  constructor(
    private navCtrl: NavController,
    public navParams: NavParams,
    private httpProvider: HttpProvider,
    private config: ConfigProvider,
    private storage: StorageProvider,
    private walletUtils: WalletUtilsProvider
  ) {
  }

  async ngOnInit() {

    this.loadActiveContracts();

    // check for unmined transactions if status has changed
    setInterval(() => this.checkUnminedTransactions(), 2000);

  }

  /**
   * Switch page status to "deploy" or "active"
   * @param segment
   */
  selectSegment(segment) {

    if (segment === 'deploy') {
      this.loadContracts();
    }

    if (segment === 'active') {
      this.loadActiveContracts();
    }

  }

  /**
   * Load deployed contracts from localstorage
   * @returns {Promise<void>}
   */
  async loadActiveContracts() {

    this.loading = true;
    await this.getDeployedContracts();
    this.loading = false;

  }

  /**
   * Load all contracts from github
   * @returns {Promise<void>}
   */
  async loadContracts() {

    this.loading = true;
    this.contracts = await this.httpProvider.getContracts();
    this.loading = false;

  }

  /**
   * Check if contract is deployed
   * @param contract
   * @returns {boolean}
   */
  isContractDeployed(contract){

    return !!this.deployedContracts.filter(_contract => _contract.name === contract.name).length;

  }

  /**
   * Tap on deploy contract
   * @param contract
   * @returns {Promise<void>}
   */
  async onDeployTap(contract) {

    // assemble urls for abi and bin file on github
    const abiUrl = `${this.config.contractsUrl}${contract.name}/${contract.name}.abi`;
    const binUrl = `${this.config.contractsUrl}${contract.name}/${contract.name}.bin`;

    // request abi and bin file contents
    const abiResponse = await this.httpProvider.get(abiUrl);
    const binResponse = '0x' + await this.httpProvider.get(binUrl);

    await this.walletUtils.deployContract(abiResponse, binResponse, [1, 2, 1])
      .catch((err) => {
        console.log(err);
        alert('There was a problem when deploying this contract');
      });

    this.getDeployedContracts();

  }

  /**
   * Tap on deployed contract to view it's contents
   * @param contract
   * @returns {Promise<void>}
   */
  async onActiveContractTap(contract) {

    const result = await this.walletUtils.connectToContract(contract.contractAddress, contract.abi);
    alert(result);

  }

  /**
   * Remove transaction reference from local storage
   * @param contract
   * @returns {Promise<void>}
   */
  async removeContractTap(contract) {

    this.deployedContracts = await this.storage.removeDeployedTransaction(contract.hash);

  }

  /**
   * Get all deployed transactions
   * @returns {Promise<void>}
   */
  async getDeployedContracts() {

    this.deployedContracts = await this.storage.getDeployedTransactions();

  }

  /**
   * Check for transaction references stored locally with unmined status
   * @returns {Promise<void>}
   */
  async checkUnminedTransactions(){

    this.deployedContracts.forEach(contract => {
      if (contract.status !== TRANSACTION_STATUS.MINED) this.checkTransactionStatus(contract);
    });

  }

  /**
   * Check the status of a transaction and update local storage
   * @param contract
   * @returns {Promise<void>}
   */
  async checkTransactionStatus(contract) {

    const transactionInfo = await this.walletUtils.getTransaction(contract.hash);
    const transactionReceiptInfo = await this.walletUtils.getTransactionReceipt(contract.hash);

    // updates the transaction and returns the array of deployed transactions
    this.deployedContracts = await this.storage.updateTransactionStatus(contract.hash, transactionReceiptInfo ? TRANSACTION_STATUS.MINED : null, transactionInfo.creates);

  }

}
