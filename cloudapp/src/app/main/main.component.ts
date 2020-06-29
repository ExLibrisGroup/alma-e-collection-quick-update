import { Component, OnInit } from '@angular/core';
import { Entity, CloudAppEventsService, EntityType } from '@exlibris/exl-cloudapp-angular-lib';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  private pageLoad$: Subscription;
  ids = new Set<string>();
  entities: Entity[] = [];

  constructor(
    private eventsService: CloudAppEventsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.pageLoad$ = this.eventsService.onPageLoad( pageInfo => {
      this.entities = (pageInfo.entities||[])
      .filter(e=>[EntityType.IEPA].includes(e.type));
    });
  }

  ngOnDestroy(): void {
    this.pageLoad$.unsubscribe();
  }

  onEntitySelected(event) {
    if (event.checked) this.ids.add(event.mmsId);
    else this.ids.delete(event.mmsId);
  }

  update() {
    const params = {ids: Array.from(this.ids).join(',')};
    this.router.navigate(['ecollection', params]);
  }
}
