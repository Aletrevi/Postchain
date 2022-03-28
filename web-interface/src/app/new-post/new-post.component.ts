import { Component, OnInit } from '@angular/core';
import { Post } from '../posts/post.model';
import { PostService } from '../posts/post.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss']
})
export class NewPostComponent implements OnInit {

  constructor(private readonly postService: PostService) {
    
  }

  ngOnInit(): void {

  }

  onCreatePost() {
    let title = (Math.random() + 1).toString(36).substring(7);
    let body = (Math.random() + 1).toString(36).substring(7);
    let author = "Trevi"

    this.createPost(title, body, author);
  }

  createPost(title: string, author: string, body: string) {
    this.postService.createPost(title, author, body).subscribe( (post: Post) => {
      // TODO: Redirect / warn user
      return post
    })
  }

}
