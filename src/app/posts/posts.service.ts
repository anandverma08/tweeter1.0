import Post from '../modal/post';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router } from "@angular/router";
import { Title } from '@angular/platform-browser';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';
const BACKEND_URL = environment.api_url + "/posts";

@Injectable({

  providedIn: 'root',
})



export class PostsService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }
  getPosts(): void {
    this.http.get<{ message: string, posts: any }>(BACKEND_URL)
      .pipe(map((doc) => {
        return doc.posts.map((post) => {
          return {
            title: post.title,
            body: post.body,
            id: post._id
          };
        });
      }))
      .subscribe((posts) => {
        this.posts = posts;
        this.postsUpdated.next(this.posts);
        this.router.navigate(["/"]);
      });
  }
  getPostUpdateListener(): Observable<Post[]> {
    return this.postsUpdated.asObservable();
  }


  getPost(id: string): Observable<{ _id: string, title: string, body: string }> {
    return this.http.get<{ _id: string, title: string, body: string }>(BACKEND_URL + '/' + id);
  }

  addPost(post): void {
    console.log('post', post);
    this.http.post(BACKEND_URL, post)
      .subscribe((message) => {
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, title: string, body: string): void {
    const post = { id, title, body };
    this.http.put(BACKEND_URL + "/" + id, post)
      .subscribe(() => {
        console.log('Success');
        this.router.navigate(["/"]);
      });

  }

  deletePost(id): void {
    this.http.delete(BACKEND_URL + '/' + id)
      .subscribe((message) => {
        const updatedPosts = this.posts.filter((post) => {
          return post.id !== id;
        });
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });

  }
}
