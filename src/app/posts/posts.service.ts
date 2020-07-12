import Post from '../modal/post';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router } from "@angular/router";
import { Title } from '@angular/platform-browser';

@Injectable({
  // we declare that this service should be created
  // by the root application injector.
  providedIn: 'root',
})

export class PostsService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  constructor(private http: HttpClient, private router : Router) { }
  getPosts(): void{
    this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
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
    return this.http.get<{ _id: string, title: string, body: string }>('http://localhost:3000/api/posts/' + id);
  }

  addPost(post): void {
    console.log('post', post);
    this.http.post('http://localhost:3000/api/posts', post)
      .subscribe((message) => {
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, title: string, body: string): void {
    const post = { id, title, body };
    this.http.put('http://localhost:3000/api/posts/' + id, post)
      .subscribe(() => {
        console.log('Success');
        this.router.navigate(["/"]);
      });

  }

  deletePost(id): void {
    this.http.delete('http://localhost:3000/api/posts/' + id)
      .subscribe((message) => {
        const updatedPosts = this.posts.filter((post) => {
          return post.id !== id;
        });
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });

  }
}
