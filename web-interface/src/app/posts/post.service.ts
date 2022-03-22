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
      super(http, 'post/posts');
    }
    
    public getAllPosts() {
      return this.get<Post[]>();
    }

    public filterPosts(){
      // TODO
      return [{
        title: "filtered post",
        author: "other",
        body: "Trevi's awesome post!"
      }]
    }

    public getMyPosts() {
      // TODO
      return [{
        title: "my post",
        author: "me",
        body: "my awesome post!"
      }]
    }

    public createPost(title: string, author: string, body: string){
      return this.post<Post>({title, author, body});
    }
}




