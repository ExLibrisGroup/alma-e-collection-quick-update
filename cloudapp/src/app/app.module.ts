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
import { SelectEntitiesComponent } from './select-entities/select-entities.component';
import { EcollectionComponent } from './ecollection/ecollection.component';
import { OptionsAutoCompleteComponent } from './ecollection/options-autocomplete.component';
import { DatePipe } from '@angular/common';
import { OptionsService } from './services/options.service';
import { EcollectionService } from './services/ecollection.service';

export function getTranslateModuleWithICU() {
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
      SelectEntitiesComponent,
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
      getTranslateModuleWithICU(),
      AlertModule,
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
