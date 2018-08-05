import {Component, OnInit, ViewChild} from '@angular/core';
import {PostsService} from "../../services/posts.service";
import {Post} from "../../models/Post";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from 'ngx-spinner';
import {NgForm} from "@angular/forms";
import {Comment} from "../../models/Comment";

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
    body: "",
  };

  comment: Comment = {
    name: '',
    email: '',
    body: ''
  };

  isAdmin = true;
  @ViewChild('form') form: NgForm;

  constructor(public  postService: PostsService,
              public  toastr: ToastrService,
              public  spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.spinner.show();

    this.postService.getPosts().subscribe((posts: Post[]) => {
      if (posts) this.spinner.hide();
      this.posts = posts;
    }, error => {
      this.toastr.error(error.message, 'Error');
    });
  }


  showReviews(id): void {
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
    this.spinner.show();
    if (form.invalid) {
      return;
    }

    const post: Post = {
      userId: 1,
      title: this.post.title,
      body: this.post.body,
    };

    this.postService.addPost(post).subscribe((item: Post) => {
      if (item) this.spinner.hide();
      this.posts.push(item);
      this.toastr.success('News successfully added', 'Message');
    }, error => {
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
        if (data) this.spinner.hide();
        this.posts = this.posts.filter(post => post.id != id);
        this.toastr.success('Post deleted success', 'Message');
      }, error => {
        this.toastr.error(error.message, 'Error');
      });
    }
  }
}
