import { Component, OnInit, ViewChild } from '@angular/core';
import { PostsService } from "../../services/posts.service";
import { Post } from "../../models/Post";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from "@angular/forms";
import { Comment } from "../../models/Comment";

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})

export class PostsComponent implements OnInit {
  posts: Post[];
  post: Post = {
    userId: 1,
    title: "",
    body: ""
  };

  isAdmin = true;
  @ViewChild('form') form: NgForm;

  constructor(
    public  postService: PostsService,
    public  toastr: ToastrService,
    public  spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spinner.show();

    this.postService.getPosts().subscribe((posts: Post[]) => {
      this.posts = posts;
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.message, 'Error');
    });
  }


  showReviews(id: number): void {
    this.postService.getPostsComments(id).subscribe((data: Comment[]) => {
      this.posts.forEach((item) => {
        if (item.id === id) {
          item.reviews = data;
        }
      })
      if (!data.length) {
        this.toastr.info('No reviews', 'Message');
      }
    }, error => {
      this.toastr.error(error.message, 'Error');
    });
  }

  onSubmit(form) {
    if (form.invalid)return;

    const post: Post = {
      userId: 1,
      title: this.post.title,
      body: this.post.body,
    };

    this.spinner.show();
    this.postService.addPost(post).subscribe((item: Post) => {
      this.posts.push(item);
      this.spinner.hide();
      this.toastr.success('News successfully added', 'Message');
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.message, 'Error');
    });
    this.form.resetForm();
  }


  onDelete(id: number, index: number) {
    //Условие для удаления созданных постов
    if (id > 100) {
      this.posts.splice(index, 1);
      this.toastr.success('Post deleted success', 'Message');
    }//Удаление постов с запросом к серверу
    else {
      this.spinner.show();
      this.postService.deletePost(id).subscribe((data: Object) => {
        this.posts = this.posts.filter(post => post.id != id);
        this.spinner.hide();
        this.toastr.success('Post deleted success', 'Message');
      }, error => {
        this.spinner.hide();
        this.toastr.error(error.message, 'Error');
      });
    }
  }
}
