import { Component, OnInit } from '@angular/core';
import Post from '../modal/post';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  storedPosts: Post[] = []
  constructor() { }
  postCreated(post){
    this.storedPosts.push(post);
  }
  ngOnInit(): void {
  }

}
