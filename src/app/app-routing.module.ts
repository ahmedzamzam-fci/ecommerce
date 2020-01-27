import { NgModule } from '@angular/core';
import { RouterModule , Routes } from '@angular/router';
import {ViewItemComponent} from './user/items/view-items/view-item.component';
import {CreateUserComponent} from './auth/create-users/create-user.component';
import {HeaderComponent } from './Header/header.component';
import {CategoryComponent} from './admin/add-category/category.component';
import {SubCategoryComponent} from './admin/add-sub-category/sub-category.component';
import {ItemsComponent} from './admin/add-items/items.component';
import {ViewItemsComponent} from './admin/admin-view-items/view-items.component';
import {CategoriesComponent} from './admin/admin-view-categories/categories.component';
import {SubCategoriesComponent} from './admin/admin-view-subcategories/sub-categories.component';
import { SidebarComponent } from './admin/admin-sidebar/sidebar.component';
import { HomeCategoriesComponent } from './home-categories/home-categories';

const routes: Routes = [
  {path: 'Items', component: ViewItemComponent},
  {path: 'SignUp', component: CreateUserComponent},
  {path: 'header', component: HeaderComponent} ,
  {path: 'category-new', component: CategoryComponent},
  {path: 'sub-category-new', component: SubCategoryComponent},
  {path: 'item-new', component: ItemsComponent},
  {path: 'Categories', component: CategoriesComponent},
  {path: 'SubCategories', component: SubCategoriesComponent},
  {path: 'edit-categories/:catId', component: CategoryComponent},
  {path: 'edit-SubCategories/:subCatId', component: SubCategoryComponent},
  {path : 'admin/items' , component : ViewItemsComponent},
  {path: 'edit-item/:itemId', component: ItemsComponent},
  {path : 'admin/sidebar' , component : SidebarComponent },
  {path : 'home-categories', component: HomeCategoriesComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports : [RouterModule]
})
export class AppRoutingModule {}
