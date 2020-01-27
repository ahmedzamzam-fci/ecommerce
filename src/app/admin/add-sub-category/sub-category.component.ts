
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit, NgZone } from '@angular/core';
import { CategoryService } from '../../services/categories.service';
import { SubCategoryService } from '../../services/subcategories.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SubCategories } from '../../model/sub-categories.model';
import { mimeType } from '../../utils/mime-type.validator';
import { Categories } from 'src/app/model/Categories.model';
import { Subscription } from 'rxjs';
// import {Categories} from '../../model/Categories.model';

@Component({
  selector: 'app-sub-category-new',
  templateUrl: './sub-category.component.html',
  styleUrls: ['../../../assets/css/style.default.css']
})

export class SubCategoryComponent implements OnInit {
  pageTitle: string;
  subCategory: SubCategories;
  isLoading = false;
  subCatForm: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private subCategoryId: string;
  // Categories: any = [];
  categories: Categories[] = [];
  catSub: Subscription;



  get formControls() { return this.subCatForm.controls; }
  constructor(
    public subCategoryService: SubCategoryService,
    public route: ActivatedRoute,
    private categoryService: CategoryService
  ) {
    this.getCategories();
  }

  ngOnInit() {
    this.pageTitle = 'Add New';
    this.subCatForm = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      desc: new FormControl(null, { validators: [Validators.required] }),
      catid: new FormControl(null , { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('subCatId')) {
        this.mode = 'edit';
        this.pageTitle = 'Edit';
        this.subCategoryId = paramMap.get('subCatId');
        console.log(this.subCategoryId);
        this.isLoading = true;
        this.subCategoryService.getSubCategory(this.subCategoryId).subscribe(subCategoryData => {
          this.isLoading = false;
          this.subCategory = {
            id: subCategoryData._id,
            name: subCategoryData.name,
            desc: subCategoryData.desc,
            catid: subCategoryData.catid,
            image: subCategoryData.image
          };
          this.imagePreview =  subCategoryData.image ;

          console.log('TESSSTTTT --> id:' + this.subCategory.id +
            'name:' + this.subCategory.name +
            'desc:' + this.subCategory.desc +
            'catid:' + this.subCategory.catid +
            'image:' + this.subCategory.image);
          this.subCatForm.setValue({
            name: this.subCategory.name,
            desc: this.subCategory.desc,
            catid: this.subCategory.catid,
            image: this.subCategory.image
          });
        });
      } else {
        this.mode = 'create';
        this.subCategoryId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.subCatForm.patchValue({ image: file });
    this.subCatForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      console.log(file.name);
    };

    reader.readAsDataURL(file);
    console.log('we\'re here 03 ');
  }
  getCategories() {
    this.categoryService.getCategories();
    this.catSub = this.categoryService.getCategoryUpdateListener().subscribe((category: Categories[]) => {
      this.isLoading = false;
      this.categories = category;
      console.log('here we go ' , this.categories );
    });

  }


  onSaveSubCategory() {
    if (this.subCatForm.invalid) {
      return;
    }
    this.isLoading = true;

    if (this.mode === 'create') {
      this.subCategoryService.addSubCategory(
        this.subCatForm.value.name,
        this.subCatForm.value.desc,
        this.subCatForm.value.catid,
        this.subCatForm.value.image
      );
    } else {
      console.log('we\'re in edit mode ');
      this.subCategoryService.updateSubCategory(
        this.subCategoryId,
        this.subCatForm.value.name,
        this.subCatForm.value.desc,
        this.subCatForm.value.catid,
        this.subCatForm.value.image
      );

      console.log('image file updated: ' + JSON.stringify(this.subCatForm.value.image));
    }
    this.subCatForm.reset();
  }
}
