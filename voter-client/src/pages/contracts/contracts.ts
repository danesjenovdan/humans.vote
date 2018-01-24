import { includes, startCase } from 'lodash';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { ConfigProvider } from '../../providers/config/config';
import { TRANSACTION_STATUS, WalletUtilsProvider } from '../../providers/wallet-utils/wallet-utils';
import { ITransaction, StorageProvider } from '../../providers/storage/storage';
import { ModalContractViewComponent } from '../../components/modal-contract-view/modal-contract-view';
import { AlertController } from 'ionic-angular';

declare var cordova;

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
    private navParams: NavParams,
    private httpProvider: HttpProvider,
    private storage: StorageProvider,
    private walletUtils: WalletUtilsProvider,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
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
  isContractDeployed(contract) {

    return !!this.deployedContracts.filter(_contract => _contract.name === contract.name).length;

  }

  /**
   * Tap on deployed contract to view it's contents
   * @param contract
   * @returns {Promise<void>}
   */
  async onActiveContractTap(contract) {

    //const result = await this.walletUtils.connectToContract(contract.contractAddress, contract.abi);
    //alert(result);

    console.log(JSON.parse(contract.abi));

    const modal = this.modalCtrl.create(ModalContractViewComponent, { contract, abi: JSON.parse(contract.abi) });
    modal.onDidDismiss(data => {
      this.getDeployedContracts();
    });
    modal.present();

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
  async checkUnminedTransactions() {

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

  /**
   * Open modal with contract deploy params
   * @param contract
   */
  async openModal(contract) {
    const abi = await this.httpProvider.getContractAbi(contract.name);
    const modal = this.modalCtrl.create(ContractFormPage, { contract, abi });
    modal.onDidDismiss(data => {
      this.getDeployedContracts();
    });
    modal.present();
  }
}

/**
 * Modal component for deploying a contract
 */
@Component({
  templateUrl: 'contractForm.html'
})
export class ContractFormPage {
  contractName: string;
  fields: Array<any>;

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    private config: ConfigProvider,
    private httpProvider: HttpProvider,
    private walletUtils: WalletUtilsProvider
  ) {

    console.log(this.params.get('abi'));

    const fields = this.params.get('abi')
      .find(item => item.type === 'constructor')
      .inputs
      .map(field => ({
        name: startCase(field.name),
        type: includes(field.type, 'int') ? 'number' : 'text',
        value: '',
      }));

    this.contractName = this.params.get('contract').name;
    this.fields = fields;
  }

  /**
   * Close modal
   */
  dismiss() {
    this.viewCtrl.dismiss();
  }

  /**
   * Tap on deploy contract
   * @param contract
   * @returns {Promise<void>}
   */
  async onDeployTap() {
    const contractArgs = this.fields.map(field => field.value);

    // assemble urls for abi and bin file on github
    const abiUrl = `${this.config.contractsUrl}${this.contractName}/${this.contractName}.abi`;
    const binUrl = `${this.config.contractsUrl}${this.contractName}/${this.contractName}.bin`;

    // request abi and bin file contents
    const abiResponse = await this.httpProvider.get(abiUrl);
    const binResponse = '0x' + await this.httpProvider.get(binUrl);

    console.log('ABI: ',JSON.parse(abiResponse));

    await this.walletUtils.deployContract(abiResponse, binResponse, this.contractName, contractArgs)
      .catch((err) => {
        console.log(err);
        alert('There was a problem when deploying this contract');
      });

    this.dismiss();
    // this.getDeployedContracts();
  }

  scanQr(field) {

    console.log('field: ', field);

    cordova.plugins.barcodeScanner.scan(
      (result) => {
        //if(!this.walletUtils.validateAddress(result.text)) return alert('Not a valid 0x address');
        field.value = result.text;
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
        resultDisplayDuration: 50, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
        formats: "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
        orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
        disableAnimations: true, // iOS
        disableSuccessBeep: true // iOS and Android
      }
    );

  }

}
