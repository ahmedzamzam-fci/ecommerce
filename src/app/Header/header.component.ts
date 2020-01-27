import { Component, OnInit } from '@angular/core';
import { Categories } from '../model/Categories.model';
import { CategoryService } from '../services/categories.service';
import { Subscription } from 'rxjs';
import { SubCategoryService } from '../services/subcategories.service';
import { SubCategories } from '../model/sub-categories.model';
import { Items } from '../model/items.model';
import { ItemsService } from '../services/items.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  categories: Categories[] = [];
  category: Categories[];
  dataSource: any;
  catSub: Subscription;
  subCatSubscribe: Subscription;
  subcategories: SubCategories[] = [];
  items: Items[] = [];
  itemsub: Subscription;
  constructor(
    private catgeoriesService: CategoryService,
    private subcategoriesService: SubCategoryService,
    private itemService: ItemsService
  ) {}
  SubCategorySelected(subCatId: string) {
    this.itemService.newSubcategoryClicked(subCatId);
  }
  ngOnInit() {
    this.catgeoriesService.getCategories();
    this.catSub = this.catgeoriesService
      .getCategoryUpdateListener()
      .subscribe((category: Categories[]) => {
        this.categories = category;
        console.log('categories', this.categories);
      });

    this.subcategoriesService.getSubCategories();
    this.subCatSubscribe = this.subcategoriesService
      .getSubCategoryUpdateListener()
      .subscribe((subcategory: SubCategories[]) => {
        this.subcategories = subcategory;
        console.log('subcategories', this.subcategories);
      });

    this.subcategories.forEach(( catid) => {
      console.log('category id ', catid.id);
      });
    this.itemService.getItems();
    this.itemsub = this.itemService
      .getItemUpdateListener()
      .subscribe((item: Items[]) => {
        this.items = item;
        console.log('items', this.items);
      });
  }
}
