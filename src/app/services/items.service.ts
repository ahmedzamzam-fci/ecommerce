import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Items } from '../model/items.model';

@Injectable({
  providedIn: 'root'

})
export class ItemsService {
  private items: Items[] = [];
  private itemsUpdated = new Subject<Items[]>();
  private subcategoryClicked = new Subject<any>();
  constructor(private http: HttpClient, private router: Router) { }
  baseUri = 'http://localhost:3000/api/items' ;
  //

  newSubcategoryClicked(ItemId: string) {
    this.subcategoryClicked.next(ItemId);
  }

  getSubcategoryClicked() {
    return this.subcategoryClicked.asObservable();
  }


  getItems() {
    this.http
      .get<{ message: string; items: any }>(this.baseUri)
      .pipe(
        map(itemData => {
          return itemData.items.map(item => {
            return {
              name: item.name,
              desc: item.desc,
              subcatid: item.subcatid,
              price: item.price,
              image: item.image,
              id: item._id

            };
          });
        })
      )
      .subscribe(transformedItems => {
        this.items = transformedItems;
        this.itemsUpdated.next([...this.items]);
      });
  }

  getItemUpdateListener() {
    return this.itemsUpdated.asObservable();
  }

  getItem(id: string) {
    return this.http.get<{ _id: string; name: string; desc: string  , subcatid: string , price: string, image: string }>(
     this.baseUri  + '/' + id
    );
  }

  addItem(name: string, desc: string , price: string , subcatid: string,  image: File ) {
    const itemData = new FormData();
    itemData.append('name', name);
    itemData.append('desc', desc);
    itemData.append('price' , price );
    itemData.append('image', image, name) ;
    itemData.append('subcatid' , subcatid);
    console.log('added item ' + itemData);
    this.http
    .post<{ message: string; item: Items }>(
      this.baseUri,
      itemData
    )
    .subscribe(responseData => {
      const item: Items = {
        id: responseData.item.id,
        name,
        desc,
        price,
        subcatid,
        image: responseData.item.image
      };
      this.items.push(item);
      this.itemsUpdated.next([...this.items]);
      this.router.navigate(['admin/items']);
    });
}

  updateItem(id: string, name: string, desc: string , price: string , subcatid: string , image: File | string ) {
    let ItemForm: Items | FormData;
    if (typeof image === 'object') {
      ItemForm = new FormData();
      ItemForm.append('id', id);
      ItemForm.append('name', name);
      ItemForm.append('desc', desc);
      ItemForm.append('price', price);
      ItemForm.append('subcatid', subcatid);
      ItemForm.append('image', image as File, name);
    } else {
      ItemForm = {
        id,
        name,
        desc,
        price,
        subcatid,
        image: image as string
      };
    }
    this.http
      .put(this.baseUri + '/' + id, ItemForm)
      .subscribe(response => {
        console.log(response);
        this.router.navigate(['admin/items']);
      });
  }

  deleteItem(itemId: string) {
    this.http
      .delete(this.baseUri + '/' + itemId)
      .subscribe(() => {
        const updatedItems = this.items.filter(item => item.id !== itemId);
        this.items = updatedItems;
        this.itemsUpdated.next([...this.items]);
      });
  }

}
