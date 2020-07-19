import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import Post from '../../modal/post';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[];
  postsSub: Subscription;
  isLoading = false;
  authStatusSub : Subscription;
  isUserAuthenticated: boolean = false
  constructor(private postsService: PostsService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getUserAuthenticationStatus().subscribe(status=>{
      this.isUserAuthenticated = status;
    })
    this.isUserAuthenticated=this.authService.getUserLoggedIn();
    this.postsService.getPosts();
    this.isLoading = true;
    this.postsSub = this.postsService.getPostUpdateListener().subscribe((posts: Post[]) => {
      this.isLoading = false;
      this.posts = posts;
    });
  }
  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  deletePost(postId): void{
    this.postsService.deletePost(postId);
  }

}
