import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { Post } from "../post.model";
import { PostService } from "../post.service";

@Injectable()
export class FilterPostsResolver implements Resolve<Post[]>{
    constructor(private postService: PostService){
    }

    resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Post[]>|Promise<Post[]>|Post[]{
      return this.postService.filterPosts();
    }

}