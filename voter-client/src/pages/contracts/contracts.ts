import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { ConfigProvider } from '../../providers/config/config';
import { WalletUtilsProvider } from '../../providers/wallet-utils/wallet-utils';
import { IContract, StorageProvider } from '../../providers/storage/storage';

/**
 * Generated class for the ContractsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-contracts',
  templateUrl: 'contracts.html',
})
export class ContractsPage implements OnInit {

  contracts: any = [];
  loading: boolean = false;
  page: string = 'active';
  activeContracts: any = [];
  deployedContracts: IContract[] = [];

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

  }

  selectSegment(segment) {

    if (segment === 'deploy') {
      this.loadContracts();
    }

    if (segment === 'active') {
      this.loadActiveContracts();
    }

  }

  async loadActiveContracts() {

    this.loading = true;
    this.deployedContracts = await this.storage.getDeployedContracts();
    this.loading = false;

  }

  async loadContracts() {

    this.loading = true;
    this.contracts = await this.httpProvider.getContracts();
    this.loading = false;

  }

  async onContractTap(contract) {

    const c = confirm(`DON'T DO THIS UNLESS YOU KNOW WHAT YOU'RE DOING`);

    if (c) {

      // assemble urls for abi and bin file on github
      const abiUrl = `${this.config.contractsUrl}${contract.name}/${contract.name}.abi`;
      const binUrl = `${this.config.contractsUrl}${contract.name}/${contract.name}.bin`;

      // request abi and bin file contents
      const abiResponse = await this.httpProvider.get(abiUrl);
      const binResponse = '0x' + await this.httpProvider.get(binUrl);

      await this.walletUtils.deployContract(abiResponse, binResponse, contract.name)
        .catch((err) => {
          console.log(err);
          alert('There was a problem when deploying this contract');
        });

      this.getDeployedContracts();

    }

  }

  async onActiveContractTap(contract) {

    this.walletUtils.connectToContract(contract.hash, contract.abi);

  }

  async getDeployedContracts() {
    this.deployedContracts = await this.storage.getDeployedContracts();
    console.log(this.deployedContracts);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContractsPage');
  }

}
