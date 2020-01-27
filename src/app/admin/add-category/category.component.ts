import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CategoryService } from '../../services/categories.service';
import { Categories } from '../../model/Categories.model';
import { mimeType } from '../../utils/mime-type.validator';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-category-new',
  templateUrl: './category.component.html',
  styleUrls: ['../../../assets/css/style.default.css', './category.component.css']
})

export class CategoryComponent implements OnInit {
  pageTitle: string ;
  private catId: string;
  catSub: Subscription;
  category: Categories;
  isLoading = false;
  categories: Categories [] = [];
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private categoryId: string;
  get formControls() { return this.form.controls; }
  constructor(
    public categoryService: CategoryService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.pageTitle = 'Add New' ;
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      desc: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
         validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('catId')) {
        console.log('Edit Mode ');
        this.mode = 'edit';
        this.pageTitle = 'Edit';
        this.categoryId = paramMap.get('catId');
        console.log('category id' + this.categoryId);
        this.isLoading = true;
        this.categoryService.getCategory(this.categoryId).subscribe(categoryData => {
          console.log('return from backend sucessfully ');
          this.isLoading = false;
          console.log('Nareman tessstt = >  ' +
          categoryData._id + '--' +
          categoryData.name + '----' +
          categoryData.desc + '------' +
          categoryData.image);

          this.category = {
            id: categoryData._id,
            name: categoryData.name,
            desc: categoryData.desc,
            image: categoryData.image
          };
          this.imagePreview =  categoryData.image ;
          this.form.setValue({
            name: categoryData.name,
            desc: categoryData.desc,
            image: categoryData.image
          });
        });
      } else {
        console.log('Create Mode ');
        this.mode = 'create';
        this.categoryId = null;

      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
  getCategories() {
    this.categoryService.getCategories();
    this.catSub = this.categoryService.getCategoryUpdateListener().subscribe((category: Categories[]) => {
      this.isLoading = false;
      this.categories = category;
      console.log(this.categories);
    });

  }




  onSaveCategory() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.categoryService.addCategory(
        this.form.value.name,
        this.form.value.desc,
        this.form.value.image
      );
    } else {
      this.categoryService.updateCategory(
        this.categoryId,
        this.form.value.name,
        this.form.value.desc,
        this.form.value.image
      );
    }
    this.form.reset();
  }
}
