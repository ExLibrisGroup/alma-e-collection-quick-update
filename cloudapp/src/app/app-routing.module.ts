import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { EcollectionComponent } from './ecollection/ecollection.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'ecollection', component: EcollectionComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
