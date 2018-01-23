
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/*
  Generated class for the ConfigProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConfigProvider {

  provider = {
    url: 'http://localhost:8545',
    chainId: 9999,
    name: 'humansvote',
  };

  constructor() {

  }

}