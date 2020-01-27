import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { CreateUserComponent } from './auth/create-users/create-user.component';
import { ViewItemComponent } from './user/items/view-items/view-item.component';
import { HeaderComponent } from './Header/header.component';
// import { NgMatSearchBarModule } from 'ng-mat-search-bar';
import { CategoryComponent } from './admin/add-category/category.component';
import {CategoryService } from './services/categories.service';
import {SubCategoryService } from './services/subcategories.service';
import {ItemsService } from './services/items.service';
import { SubCategoryComponent } from './admin/add-sub-category/sub-category.component';
import { ItemsComponent } from './admin/add-items/items.component';
// added in testing the file upload function
import {ViewItemsComponent} from './admin/admin-view-items/view-items.component';
import { FileSelectDirective } from 'ng2-file-upload';
import { CategoriesComponent} from './admin/admin-view-categories/categories.component';
import {SubCategoriesComponent} from './admin/admin-view-subcategories/sub-categories.component';
import {SidebarComponent} from './admin/admin-sidebar/sidebar.component' ;
// end of import
import {
  MatInputModule,
  MatButtonModule,
  MatFormFieldModule,
  MatSelectModule,
  MatCardModule,
  MatToolbarModule,
  MatListModule,
  MatExpansionModule,
  MatTabsModule,
  MatTreeModule,
  MatTableModule,
  MatSortModule,
  // MatTableDataSource,
  // MatPaginator,
  // MatPaginatorModule

} from '@angular/material';
import { HomeCategoriesComponent } from './home-categories/home-categories';

@NgModule({
  declarations: [
    AppComponent,
    CreateUserComponent,
    HeaderComponent,
    ViewItemComponent,
    CategoryComponent,
    SubCategoryComponent,
    ItemsComponent,
    ViewItemsComponent,
    FileSelectDirective,
    CategoriesComponent,
    SubCategoriesComponent,
    SidebarComponent,
    HomeCategoriesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    HttpClientModule,
    MatToolbarModule,
    MatListModule,
    MatExpansionModule,
    MatTabsModule,
    MatTreeModule,
    MatCardModule,
    MatTabsModule,
    MatTableModule,
    MatSortModule

    // MatPaginator ,
    // MatPaginatorModule,
    // MatTableDataSource
    // ,
    // NgMatSearchBarModule
  ],
  providers: [
    CategoryService,
    SubCategoryService,
    ItemsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
