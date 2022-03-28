import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NavbarComponent } from './navbar/navbar.component';
import { PostsComponent } from './posts/posts.component';
import { PostService } from './posts/post.service';
import { AllPostsResolver } from './posts/resolvers/allposts.resolver';
import { HttpClientModule } from '@angular/common/http';
import { MyPostsResolver } from './posts/resolvers/my-posts.resolver';
import { FilterPostsResolver } from './posts/resolvers/filter-posts.resolver';
import { NewPostComponent } from './new-post/new-post.component';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PostsComponent,
    NewPostComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    HttpClientModule
  ],
  providers: [
    PostService,
    AllPostsResolver,
    MyPostsResolver,
    FilterPostsResolver,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
