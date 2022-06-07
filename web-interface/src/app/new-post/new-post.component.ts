import { Component, OnInit } from '@angular/core';
import { Post } from '../posts/post.model';
import { PostService } from '../posts/post.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss'],
  template:`
  author: <input type="text" [(ngModel)]="author">
`,
})
export class NewPostComponent implements OnInit {

  author: string = '';
  title: string = '';
  body: string = '';

  constructor(private readonly postService: PostService) {
    
  }

  ngOnInit(): void {

  }

  onSubmitPost() {
    this.createPost(this.title, this.body, this.author);
  }


  createPost(title: string, author: string, body: string) {
    this.postService.createPost(title, author, body).subscribe( (post: Post) => {
      // TODO: Redirect / warn user
      return post
    })
  }

}
