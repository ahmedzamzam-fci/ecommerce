import { Component, OnInit, OnDestroy } from '@angular/core';
import { Categories } from '../model/Categories.model';
import { CategoryService } from '../services/categories.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-categories',
  templateUrl: './home-categories.html',
  styleUrls: ['./home-categories.css']
})

export class HomeCategoriesComponent implements OnInit {
  categories: Categories[] = [];
  catsub: Subscription;
  constructor(private categoriesservice: CategoryService) { }
  ngOnInit() {
    this.categoriesservice.getCategories();
    this.catsub = this.categoriesservice.getCategoryUpdateListener().subscribe((category: Categories[]) => {
      this.categories = category;
    });
  }
}
