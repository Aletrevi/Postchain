import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PostsComponent } from './posts/posts.component';
import { AllPostsResolver } from './posts/resolvers/allposts.resolver';
import { MyPostsResolver } from './posts/resolvers/my-posts.resolver';
import { FilterPostsResolver } from './posts/resolvers/filter-posts.resolver';
import { NewPostComponent } from './new-post/new-post.component';

const routes: Routes = [
  
    {
      path: 'dashboard',
      component: PostsComponent,
      resolve: {
        posts: AllPostsResolver, 
      }
    },
    {
      path: 'searchPosts',
      component: PostsComponent,
      resolve: {
        posts: FilterPostsResolver, 
      }
    },
    {
      path: 'my-posts',
      component: PostsComponent,
      resolve: {
        posts: MyPostsResolver, 
      }
    },
    {
      path: 'new-post',
      component: NewPostComponent,
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },

]
;

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
