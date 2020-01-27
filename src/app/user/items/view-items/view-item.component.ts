import {Component, OnInit} from '@angular/core';
import { Items } from '../../../model/items.model';
import { ItemsService } from 'src/app/services/items.service';
import { skipUntil } from 'rxjs/operators';
@Component ({
    selector: 'app-view-item',
    templateUrl : './view-item.component.html',
    styleUrls: ['./view-item.component.css']
})
export class ViewItemComponent implements OnInit {
    Item: Items;
    Items: Items[];
    subCatId: string;
    constructor(private itemService: ItemsService) {}
    ngOnInit() {
      this.itemService.getSubcategoryClicked().subscribe( ReturnedsubCatId => {
        this.subCatId = ReturnedsubCatId;
      });
    }







}
