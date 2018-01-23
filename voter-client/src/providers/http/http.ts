import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the HttpProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HttpProvider {

  constructor(public http: HttpClient) {
    console.log('Hello HttpProvider Provider');
  }

  getContracts() {
    return this.http.get('https://api.github.com/repos/danesjenovdan/humans.vote/contents/bin/contracts').toPromise();
  }

  get(url): Promise<string> {
    return this.http.get(url, { responseType: 'text' }).toPromise();
  }

}
