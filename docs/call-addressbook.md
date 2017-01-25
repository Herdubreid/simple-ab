## Get the Address Book
We ended the [get started](get-started.md) exercise with a working app that validates the AIS url and displays its version.  
Now we can move on to our Address Book.

#### Get the e1-helper
We've imported the E1 Service Module as a contained library that provides us with the AIS service calls that we need.  We don't need to know the details of how the calls are made or customise their behavior.  We only need the call signatures for the implementations.  
When it comes to the implementation we however need the actual code -- but also don't want to have to rewrite the same logic again and again.  
This might be a shock to purists, but the plain copy-and-paste is a very efficient way of re-using code.  [GitHub](https://github.com) has what they call Gist for the purpose of sharing commonly used code-snippets.  My Gist has what I call [e1-helper](https://gist.github.com/Herdubreid/e7609368ac889103c8a74309d09c7be7) functions encapsulate the authentication into a form request.  
The justification for these functions is that a mobile app can be in three authenticated states:

    1. Not Authenticated yet (no AIS token)
    2. Authentication expired (AIS token expired)
    3. Authenticated (AIS token valid)

The e1-helper functions save us from having to test the authenticate state every time we make a form request.  So lets add it to our app.  
Create a new folder under `src` and name it `e1` (this is where we put our e1 related code).  And under `src/e1` create new file named `e1-helper.ts` and copy-and-paste the e1-helper gist into it.
To make the `e1-helper` available to our app, open the `app.module.ts` and make the following changes:

```javascript
import { E1HelperService } from '../e1/e1-helper';  // <--- New import

  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    E1HelperService  // <--- Our E1HelperService
  ]
```

#### Create the AB request
The E1 application we want to use is 'A/B Word Search' (P01BDWRD).  Create a new file in `src/e1` for the request and call it `ab-word-search.ts` (remember `kebab case` for files, just to confuse everyone, ionic uses `.` for files).  
And add the following code:

```javascript
import { FormRequest, FormAction } from 'e1-service';

export class AbWordSearchRequest extends FormRequest {
    constructor(search: string) {
        super();
        this.formName = 'P01BDWRD_W01BDWRDA';
        this.formServiceAction = 'R';
        this.formActions = new Array<FormAction>();
        this.formActions.push({
            controlID: '18',
            command: 'SetControlValue',
            value: search
        });
        this.formActions.push({
            controlID: 15,
            command: 'DoAction'
        })
    }
}
```

The `AbWordSearchRequest` class encapsulates the information needed for the request.  We pass it a search word string which gets passed to `controlID` 18 and press the find button with is `controlID` 15.

#### Make the call
We are now ready to create our request for AIS.  
Open up the `home.ts` file and make the following changes:

```javascript
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { SignonService, FormService, IServerState } from 'e1-service';  // <--- Add FormService
import { E1HelperService } from '../../e1/e1-helper';  // <--- Import the e1-helper
import { AbWordSearchRequest } from '../../e1/ab-word-search'; // <--- Import our A/B Word Search Request¸

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  aisVersion: any;
  constructor(
    store: Store<{ server: IServerState }>,
    signon: SignonService,
    form: FormService,  // <--- Inject the FormService
    e1: E1HelperService  // <--- Inject the e1-helper
  ) {
    this.aisVersion = store.select<string>('server', 'defaultconfig', 'aisVersion');
    signon.testUrl(
      'https://jde02.uxcredrock.com/mobile/',
      {
        success: () => {
          console.log('Valid Url!');
          form.request = new AbWordSearchRequest('peter');  // <--- Look for peter
          e1.call(form);  // <--- make the request with the e1-helper
        },
        error: (msg) => {
          console.log('Error in Url:', msg);
        }
      });
  }
}
````
