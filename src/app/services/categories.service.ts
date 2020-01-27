import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Categories } from '../model/Categories.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categories: Categories[] = [];
  private categoriesUpdated = new Subject<Categories[]>();
  constructor(private http: HttpClient, private router: Router) {}

  baseUri = 'http://localhost:3000/api/categories';

  getCategories() {
    this.http
      .get<{ categories: any }>(this.baseUri)
      .pipe(
        map(categoryData => {
          return categoryData.categories.map(category => {
            return {
              name: category.name,
              desc: category.desc,
              image: category.image,
              id: category._id
            };
          });
        })
      )
      .subscribe(transformedCategories => {
        this.categories = transformedCategories;
        this.categoriesUpdated.next([...this.categories]);
      });
    return this.http.get(this.baseUri);
  }

  getCategoryUpdateListener() {
    return this.categoriesUpdated.asObservable();
  }

  getCategory(id: string) {
    return this.http.get<{
      _id: string;
      name: string;
      desc: string;
      image: string;
    }>(this.baseUri + '/' + id);
  }

  addCategory(name: string, desc: string, image: File) {
    const categoryData = new FormData();
    categoryData.append('name', name);
    categoryData.append('desc', desc);
    categoryData.append('image', image, name);

    this.http
      .post<{ message: string; category: Categories }>(
        this.baseUri,
        categoryData
      )
      .subscribe(responseData => {
        const category: Categories = {
          id: responseData.category.id,
          name,
          desc,
          image: responseData.category.image
        };
        this.categories.push(category);
        this.categoriesUpdated.next([...this.categories]);
        this.router.navigate(['/']);
      });
  }

  // updateCategory(id: string, name: string, desc: string, image: string) {
  //   const category: Categories = { id, name, desc, image };
  //   this.http
  //     .put(this.baseUri + '/' + id, category)
  //     .subscribe(response => {
  //       const updatedCategories = [...this.categories];
  //       const oldCategoryIndex = updatedCategories.findIndex(p => p.id === category.id);
  //       updatedCategories[oldCategoryIndex] = category;
  //       this.categories = updatedCategories;
  //       this.categoriesUpdated.next([...this.categories]);
  //       this.router.navigate(['/']);
  //     });
  // }
  updateCategory(
    id: string,
    name: string,
    desc: string,
    image: File | string
  ) {
    let CatFrom: Categories | FormData;
    if (typeof image === 'object') {
      CatFrom = new FormData();
      CatFrom.append('id', id);
      CatFrom.append('name', name);
      CatFrom.append('desc', desc);
      CatFrom.append('image', image as File, name);
    } else {
      CatFrom = {
        id,
        name,
        desc,
        image: image as string
      };
    }
    this.http
    .put(this.baseUri + '/' + id , CatFrom )
    .subscribe(() => {
      console.log('inside update service subscription');
      this.router.navigate(['/Categories']);
    });
  }

  deleteCategory(categoryId: string) {
    this.http.delete(this.baseUri + '/' + categoryId).subscribe(() => {
      const updatedCategories = this.categories.filter(
        category => category.id !== categoryId
      );
      this.categories = updatedCategories;
      this.categoriesUpdated.next([...this.categories]);
    });
  }
  // errorMgmt(error: HttpErrorResponse) {
  //   let errorMessage = '';
  //   if (error.error instanceof ErrorEvent) {
  //     // Get client-side error
  //     errorMessage = error.error.message;
  //   } else {
  //     // Get server-side error
  //     errorMessage = 'Error Code: ${error.status}\nMessage: ${error.message}';
  //   }
  //   console.log(errorMessage);
  //   return throwError(errorMessage);
  // }
}
