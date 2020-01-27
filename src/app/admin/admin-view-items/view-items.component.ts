import { Component, OnInit, OnDestroy } from '@angular/core';
import { ItemsService } from 'src/app/services/items.service';
import { Items } from 'src/app/model/items.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-items',
  templateUrl: './view-items.component.html',
  styleUrls : ['./view-items.component.css']
})
export class ViewItemsComponent implements OnInit, OnDestroy {
  items: Items[] = [];
  itemsSub: Subscription;

  constructor(private itemService: ItemsService) { }

  ngOnInit() {
    this.itemService.getItems();
    this.itemsSub = this.itemService.getItemUpdateListener().subscribe(
      (items: Items[]) => {
        console.log(items);
        this.items = items;
      });
  }
  ngOnDestroy() {
    this.itemsSub.unsubscribe();
  }

  onDelete(id: string) {
    this.itemService.deleteItem(id);

  }

}

