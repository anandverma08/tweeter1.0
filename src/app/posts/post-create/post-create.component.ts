import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";

import { PostsService } from "../posts.service";
import Post from "../../modal/post";
import { Subscription } from "rxjs";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.scss"]
})
export class PostCreateComponent implements OnInit {
  post: Post;
  isLoading = false;
  form: FormGroup;
  private mode = "create";
  private postId: string;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {

    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      body: new FormControl(null, { validators: [Validators.required] })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("id")) {
        this.mode = "edit";
        this.postId = paramMap.get("id");
        this.isLoading = true;

        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;

          this.post = {
            id: postData._id,
            title: postData.title,
            body: postData.body
          }
          this.form.setValue({
            title: this.post.title,
            body: this.post.body
          });
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }



  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.postsService.addPost({
        title: this.form.value.title,
        body: this.form.value.body
      }
      );
      this.isLoading = false;
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.body
      );
      this.isLoading = false;
    }
    this.form.reset();
  }
}
