import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { SignonService, FormService, IServerState } from 'e1-service';
import { E1HelperService } from '../../e1/e1-helper';
import { AbWordSearchRequest, IAbWordSearchResponse } from '../../e1/ab-word-search';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  aisVersion: any;
  abWordSearchResponse: IAbWordSearchResponse;
  constructor(
    store: Store<{ server: IServerState }>,
    signon: SignonService,
    form: FormService,
    e1: E1HelperService
  ) {
    this.aisVersion = store.select<string>('server', 'defaultconfig', 'aisVersion');
    store.select<IAbWordSearchResponse>('server', 'formResponse')
      .subscribe(response => this.abWordSearchResponse = response);
    signon.testUrl(
      'https://jde02.uxcredrock.com/mobile/',
      {
        success: () => {
          console.log('Valid Url!');
          form.request = new AbWordSearchRequest('peter');
          e1.call(form);
        },
        error: (msg) => {
          console.log('Error in Url:', msg);
        }
      });
  }
}
