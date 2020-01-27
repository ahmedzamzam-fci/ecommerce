import { Component, OnInit, OnDestroy } from '@angular/core';
import { Categories } from '../../model/Categories.model';
import { Subscription } from 'rxjs';
import { CategoryService } from '../../services/categories.service';

import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit, OnDestroy {


  // @ViewChild(MatPaginatorModule, {static: true}) paginator: MatPaginatorModule;
  constructor(private catgeoriesService: CategoryService ) {}

  categories: Categories[] = [];
  category: Categories[];
  // dataSource: any;
  catSub: Subscription;
  isLoading = false;
  displycolumen: string[] = ['name', 'desc', 'image', 'status'];
  dataSource;

  ngOnInit() {

    // this.dataSource.paginator = this.paginator;
    this.isLoading = true;
    this.catgeoriesService.getCategories();
    this.catSub = this.catgeoriesService
      .getCategoryUpdateListener()
      .subscribe((category: Categories[]) => {
        this.dataSource = new MatTableDataSource<Categories>(this.categories);
        this.isLoading = false;
        this.categories = category;
        console.log(this.categories);
      });

  }

  onDelete(id: string) {
    this.catgeoriesService.deleteCategory(id);
  }
  ngOnDestroy() {
    this.catSub.unsubscribe();
  }
 public  applyFilter(filterValue: string) {

  this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
