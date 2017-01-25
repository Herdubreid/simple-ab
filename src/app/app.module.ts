import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { E1ServiceModule, serverAction, initialServerState } from 'e1-service';
import { E1HelperService } from '../e1/e1-helper';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    E1ServiceModule,
    StoreModule.provideStore({ server: serverAction }, { server: initialServerState }),
    StoreDevtoolsModule.instrumentOnlyWithExtension()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    E1HelperService
  ]
})
export class AppModule { }
