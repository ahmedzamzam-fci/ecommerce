import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubCategories } from '../../model/sub-categories.model';
import { Subscription } from 'rxjs';
import { SubCategoryService } from '../../services/subcategories.service';

@Component({
  selector: 'app-sub-category-new',
  templateUrl: './sub-categories.component.html',
  styleUrls: ['../../../assets/css/style.default.css', './sub-categories.component.css']
})
export class SubCategoriesComponent implements OnInit, OnDestroy {
  subCategories: SubCategories[] = [];
  subCategory: SubCategories[];
  dataSource: any;
  subCatSub: Subscription;
  isLoading = false;
  displycolumen: string[] = ['name', 'desc', 'catname', 'image', 'status'];
  constructor(private subCatgeoriesService: SubCategoryService) { }

  ngOnInit() {
    this.isLoading = true;
    this.subCatgeoriesService.getSubCategories();
    this.subCatSub = this.subCatgeoriesService
      .getSubCategoryUpdateListener()
      .subscribe((subCategory: SubCategories[]) => {
        this.isLoading = false;
        this.subCategories = subCategory;
        console.log(this.subCategories);
      });
  }



  onDelete(id: string) {
    this.subCatgeoriesService.deleteSubCategory(id);
    // this.ngOnInit();
  }
  ngOnDestroy() {
    this.subCatSub.unsubscribe();
  }
}
