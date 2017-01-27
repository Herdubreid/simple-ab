import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from 'ionic-angular';
import { SignonService, IServiceCallback } from 'e1-service';
/*
  Helper functions for e1-service.
  Usage:
    Use the call function with the service to use and callback parameters.
    If no token, then the call is directed to callWithSignonPrompt.
    If call returns error, then try signon and call the service again.
*/

function signonPrompt(ok, cancel, msg = ''): any {
  return {
    title: 'Sign In',
    message: msg,
    enableBackdropDismiss: false,
    inputs: [
      {
        name: 'username',
        placeholder: 'User ID',
        type: 'text'
      },
      {
        name: 'password',
        placeholder: 'Password',
        type: 'password'
      }
    ],
    buttons: [
      {
        text: 'Cancel',
        handler: cancel
      },
      {
        text: 'Ok',
        handler: ok
      }
    ]
  }
}

export interface IServiceCall {
  call(callback: IServiceCallback);
}
@Injectable()
export class E1HelperService {
  callWithSignonPrompt(service: IServiceCall, callback: IServiceCallback = {}) {
    if (this.signon.inCall) {
      return;
    }
    let prompt = this.promptCtrl.create(signonPrompt(
      cred => {
        if (cred.username && cred.password) {
          let loading = this.loadCtrl.create({
            content: 'Signing in..'
          });
          loading.present();
          this.signon.username = cred.username;
          this.signon.password = cred.password;
          this.signon.authenticate({
            success: () => {
              service.call(callback);
              prompt.dismiss();
            },
            error: msg => prompt.setMessage('Signon failed: ' + msg.statusText),
            done: () => loading.dismiss()
          });
        }
        return false;
      },
      () => { }
    ));
    prompt.present();
  }
  callWithSignon(service: IServiceCall, callback: IServiceCallback = {}) {
    if (this.signon.inCall) {
      return;
    }
    this.signon.authenticate({
      success: () => service.call(callback),
      error: () => this.callWithSignonPrompt(service, callback)
    });
  }
  call(service: IServiceCall, callback: IServiceCallback = {}) {
    let cb = Object.assign({}, callback, {
      error: msg => this.callWithSignon(service, callback)
    });
    if (this.signon.hasToken) {
      service.call(cb)
    } else {
      this.callWithSignonPrompt(service, callback);
    }
  }
  constructor(
    public promptCtrl: AlertController,
    public loadCtrl: LoadingController,
    public signon: SignonService
  ) {
  }
}
