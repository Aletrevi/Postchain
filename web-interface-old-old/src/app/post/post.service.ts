import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../http/http.service';
import { Post } from './post.model';
@Injectable({
  providedIn: 'root'
})
export class PostService extends HttpService<Post>{

  constructor(protected readonly http: HttpClient
    ) {
      super(http, 'posts');
    }
    public getAllPosts() {
      return this.get<Post>();
    }
    public getPosts(){

    }
    public createPost(title: String, author: String, body: String){
      return this.post<Post>({title, author, body});
    }
}




