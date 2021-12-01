import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule, LazyTranslateLoader, AlertModule } from '@exlibris/exl-cloudapp-angular-lib';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader, TranslateParser } from '@ngx-translate/core';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MainComponent } from './main/main.component';
import { EcollectionComponent } from './ecollection/ecollection.component';
import { OptionsAutoCompleteComponent } from './ecollection/options-autocomplete.component';
import { DatePipe } from '@angular/common';
import { OptionsService } from './services/options.service';
import { EcollectionService } from './services/ecollection.service';
import { SelectEntitiesModule } from 'eca-components';

export function CloudAppTranslateModuleWithICU() {
  return TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useClass: (LazyTranslateLoader)
    },
    parser: {
      provide: TranslateParser,
      useClass: TranslateICUParser
    }
  });
}

@NgModule({
   declarations: [
      AppComponent,
      MainComponent,
      EcollectionComponent,
      OptionsAutoCompleteComponent
   ],
   imports: [
      MaterialModule,
      BrowserModule,
      BrowserAnimationsModule,
      AppRoutingModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      CloudAppTranslateModuleWithICU(),
      AlertModule,
      SelectEntitiesModule,
   ],
   providers: [
      DatePipe,
      OptionsService,
      EcollectionService
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
