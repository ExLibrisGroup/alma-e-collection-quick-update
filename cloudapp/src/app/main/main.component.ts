import { Component, OnInit } from '@angular/core';
import { Entity } from '@exlibris/exl-cloudapp-angular-lib';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  selectedEntities = new Array<Entity>();
  entityCount = 0;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

  update() {
    const params = {ids: this.selectedEntities.map(e => e.id).join(',')};
    this.router.navigate(['ecollection', params]);
  }
}
