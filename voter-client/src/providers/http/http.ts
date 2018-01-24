import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigProvider } from '../../providers/config/config';

/*
  Generated class for the HttpProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HttpProvider {

  constructor(
    public http: HttpClient,
    private config: ConfigProvider,
  ) {
    console.log('Hello HttpProvider Provider');
  }

  /**
   * Get contracts from github
   * @returns {Promise<Object>}
   */
  getContracts() {
    return this.http.get('https://api.github.com/repos/danesjenovdan/humans.vote/contents/bin/contracts').toPromise();
  }

  /**
   * Get contracts from github
   * @param contractName
   * @returns {Promise<any>}
   */
  getContractAbi(contractName): Promise<any> {
    return this.http.get(`${this.config.contractsUrl}${contractName}/${contractName}.abi?troaaslo=true`).toPromise();
  }

  /**
   * Utility HTTP get method
   * @param url
   * @returns {Promise<string>}
   */
  get(url): Promise<string> {
    return this.http.get(url+'?troasalo=true', { responseType: 'text' }).toPromise();
  }

}
