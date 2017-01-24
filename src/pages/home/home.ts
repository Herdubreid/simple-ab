import { Component } from '@angular/core';
import { SignonService } from 'e1-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(
    signon: SignonService
  ) {
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
