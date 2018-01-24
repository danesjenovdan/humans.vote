import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/*
  Generated class for the ConfigProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConfigProvider {

  contractsUrl = 'https://raw.githubusercontent.com/danesjenovdan/humans.vote/master/bin/contracts/';
  port: number = 8683;
  genesis: any = {};
  serverUrl: string = 'http://chain.humans.vote';
  demoWalletKey: string = '0x91099b87784687129a314094e8a5ff273f5d914a6c23413b714087ba5139cf4c';
  contractAddress: string;
  isAdmin: boolean = false;
  provider = {
    url: '',
    chainId: 8692,
    name: 'humansvote',
  };

  constructor() {

  }

}
