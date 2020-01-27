
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit, NgZone } from '@angular/core';
import { ItemsService } from '../../services/items.service';
import { SubCategoryService } from '../../services/subcategories.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SubCategories } from '../../model/sub-categories.model';
import { mimeType } from '../../utils/mime-type.validator';
import { Subscription } from 'rxjs';
import { Items } from '../../model/items.model';
// import {Categories} from '../../model/Categories.model';

@Component({
  selector: 'app-item-new',
  templateUrl: './items.component.html',
  styleUrls: ['../../../assets/css/style.default.css', './items.component.css']
})

export class ItemsComponent implements OnInit {
  pageTitle: string ;
  item: Items;
  isLoading = false;
  itemForm: FormGroup;
  imagePreview: string;

  private mode = 'create';
  private itemId: string;
  subCategories: SubCategories[] = [];
  subCatSub: Subscription;



  get formControls() { return this.itemForm.controls; }
  constructor(
    public itemService: ItemsService,
    public route: ActivatedRoute,
    private ngZone: NgZone,
    private subCategoryService: SubCategoryService
  ) {
    this.getSubCategories();
  }

  ngOnInit() {

    this.itemForm = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      desc: new FormControl(null, { validators: [Validators.required] }),
      price: new FormControl(null, { validators: [Validators.required] }),
      subcatid: new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('itemId')) {
        console.log('in edit mode');
        this.pageTitle = 'Edit' ;
        this.mode = 'edit';
        this.itemId = paramMap.get('itemId');
        this.isLoading = true;
        this.itemService.getItem(this.itemId).subscribe(itemData => {
          console.log('return from backend sucessfully ');
          this.isLoading = false;
          console.log(' 3yza a3rf  = >  ' +
          itemData._id + '--' +
          itemData.name + '----' +
          itemData.desc + '------' +
          itemData.image + '----' +
          itemData.subcatid);
          this.item = {
            id: itemData._id,
            name: itemData.name,
            desc: itemData.desc,
            price: itemData.price,
            image: itemData.image,
            subcatid: itemData.subcatid,

          };
          console.log('items subCatID --->> ' + itemData.subcatid  );
          this.imagePreview = itemData.image;
          this.itemForm.setValue({
            name: itemData.name,
            desc: itemData.desc,
            price: itemData.price,
            subcatid: itemData.subcatid,
            image: itemData.image
          });
        });
      } else {
        this.mode = 'create';
        this.itemId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.itemForm.patchValue({ image: file });
    this.itemForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
  getSubCategories() {
    this.subCategoryService.getSubCategories();
    this.subCatSub = this.subCategoryService.getSubCategoryUpdateListener().subscribe((subCategory: SubCategories[]) => {
      this.isLoading = false;
      this.subCategories = subCategory;
      console.log(this.subCategories);
    });

  }


  onSaveItem() {
    if (this.itemForm.invalid) {
      console.log('form is invalid');
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      console.log( 'name  ' + this.itemForm.value.name + ' desc  ' +
        this.itemForm.value.desc + 'price ' +
        this.itemForm.value.price + 'subcat id ',
        this.itemForm.value.subcatid +  'image  ',
        this.itemForm.value.image);

      this.itemService.addItem(
        this.itemForm.value.name,
        this.itemForm.value.desc,
        this.itemForm.value.price,
        this.itemForm.value.subcatid,
        this.itemForm.value.image
      );
    } else {
      this.itemService.updateItem(
        this.itemId,
        this.itemForm.value.name,
        this.itemForm.value.desc,
        this.itemForm.value.price,
        this.itemForm.value.subcatid,
        this.itemForm.value.image
      );
    }

    this.itemForm.reset();
  }
}
