import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from 'ionic-angular';
import { SignonService, IServiceCallback } from 'e1-service';
/*
  Helper functions for e1-service.
  Usage:
    Use the call function with the service to use and callback parameters.
    If no token, then the call is directed to callWithSignonPrompt.
    If call returns error, then try signon and call the service again.
  callWithSignonPrompt: Display signon
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
  callWithSignonInProgress: boolean = false;
  callWithSignonPromptInProgress: boolean = false;
  callWithSignonPrompt(service: IServiceCall, callback: IServiceCallback = {}) {
    if (this.callWithSignonPromptInProgress) {
      return;
    }
    this.callWithSignonPromptInProgress = true;
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
              this.callWithSignonPromptInProgress = false;
            },
            error: msg => prompt.setMessage('Signon failed: ' + msg.statusText),
            done: () => loading.dismiss()
          });
        }
        return false;
      },
      () => {
        this.callWithSignonPromptInProgress = false;
      }
    ));
    prompt.present();
  }
  callWithSignon(service: IServiceCall, callback: IServiceCallback = {}) {
    if (this.callWithSignonInProgress) {
      return;
    }
    this.callWithSignonInProgress = true;
    this.signon.authenticate({
      success: () => service.call(callback),
      error: () => this.callWithSignonPrompt(service, callback),
      done: this.callWithSignonInProgress = false
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