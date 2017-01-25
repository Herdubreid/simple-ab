import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { SignonService, IServerState } from 'e1-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  aisVersion: any;
  constructor(
    store: Store<{ server: IServerState }>,
    signon: SignonService
  ) {
    this.aisVersion = store.select<string>('server', 'defaultconfig', 'aisVersion');
    signon.testUrl(
      'https://jde02.uxcredrock.com/mobile/',
      {
        success: () => {
          console.log('Valid Url!');
        },
        error: (msg) => {
          console.log('Error in Url:', msg);
        }
      });
  }
}
