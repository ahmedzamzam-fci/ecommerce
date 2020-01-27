import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SubCategories } from '../model/sub-categories.model';

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {
  private subcategories: SubCategories[] = [];
  private subCategoriesUpdated = new Subject<SubCategories[]>();
  constructor(private http: HttpClient, private router: Router) {}

  baseUri = 'http://localhost:3000/api/subcategories';

  getSubCategories() {
    this.http
      .get<{ subcategories: any }>(this.baseUri)
      .pipe(
        map(subCategoryData => {
          return subCategoryData.subcategories.map(subCategory => {
            return {
              name: subCategory.name,
              desc: subCategory.desc,
              catid: subCategory.catid,
              image: subCategory.image,
              id: subCategory._id
            };
          });
        })
      )
      .subscribe(transformedSubCategories => {
        this.subcategories = transformedSubCategories;
        this.subCategoriesUpdated.next([...this.subcategories]);
      });
    return this.http.get(this.baseUri);
  }

  getSubCategoryUpdateListener() {
    return this.subCategoriesUpdated.asObservable();
  }

  getSubCategory(id: string) {
    return this.http.get<{
      _id: string;
      name: string;
      desc: string;
      catid: string;
      image: string;
    }>(this.baseUri + '/' + id);
  }

  addSubCategory(name: string, desc: string, catid: string, image: File) {
    const subCategoryData = new FormData();
    subCategoryData.append('name', name);
    subCategoryData.append('desc', desc);
    subCategoryData.append('catid', catid);
    subCategoryData.append('image', image, name);
    console.log('we\'re here ');
    this.http
      .post<{ message: string; subCategory: SubCategories }>(
        this.baseUri,
        subCategoryData
      )
      .subscribe(responseData => {
        const subCategory: SubCategories = {
          id: responseData.subCategory.id,
          // id: responseData.subCategory.id,
          name,
          desc,
          catid,
          image: responseData.subCategory.image
        };
        this.subcategories.push(subCategory);
        this.subCategoriesUpdated.next([...this.subcategories]);
        this.router.navigate(['/SubCategories']);
      });
  }

  updateSubCategory(
    id: string,
    name: string,
    desc: string,
    catid: string,
    image: File | string
  ) {
    let subCatFrom: SubCategories | FormData;
    if (typeof image === 'object') {
      subCatFrom = new FormData();
      subCatFrom.append('id', id);
      subCatFrom.append('name', name);
      subCatFrom.append('desc', desc);
      subCatFrom.append('catid', catid);
      subCatFrom.append('image', image as File, name);
    } else {
      subCatFrom = {
        id,
        name,
        desc,
        catid,
        image: image as string
      };
    }
    // const subCategory: SubCategories = {  id, name, desc, catid, image: image as string };
    this.http.put(this.baseUri + '/' + id, subCatFrom).subscribe(() => {
      console.log('inside update service subscription');
      // const updatedSubCategories = [...this.subcategories];
      // const oldSubCategoryIndex = updatedSubCategories.findIndex(p => p.id === subCategory.id);
      // updatedSubCategories[oldSubCategoryIndex] = subCatFrom as SubCategories;
      // this.subcategories = updatedSubCategories;
      // this.subCategoriesUpdated.next([...this.subcategories]);
      this.router.navigate(['/SubCategories']);
    });
  }

  deleteSubCategory(subCategoryId: string) {
    this.http.delete(this.baseUri + '/' + subCategoryId).subscribe(() => {
      const updatedSubCategories = this.subcategories.filter(
        subCategory => subCategory.id !== subCategoryId
      );
      this.subcategories = updatedSubCategories;
      this.subCategoriesUpdated.next([...this.subcategories]);
    });
  }
}
