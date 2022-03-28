import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Post } from './post.model';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  public posts: Post[] = [];
  constructor(private readonly activatedRoute: ActivatedRoute) 
  { 
    
    this.activatedRoute.data.pipe(
      tap(({ posts}) => this.posts=posts)
    ).subscribe()
  }

  ngOnInit(): void {
  }

}
