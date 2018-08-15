import { Component, OnInit } from '@angular/core';
import { PostsService } from "../../services/posts.service";
import { Post } from "../../models/Post";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from 'ngx-spinner';
import { Comment } from "../../models/Comment";

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})

export class PostsComponent implements OnInit {
  posts: Post[];


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
      });
      if (!data.length) {
        this.toastr.info('No reviews', 'Message');
      }
    }, error => {
      this.toastr.error(error.message, 'Error');
    });
  }


  onAddPost(post: Post): void {
    this.posts.unshift(post);
    this.spinner.hide();
  }


  onUpdatePost(post: Post): void {
    this.posts.forEach((data) => {
      if (post.id === data.id) {
        Object.assign( data, post);
      }
    });
  }


  onEdit(post: Post): void {
    this.postService.emitEditEvent(post);
  }


  onDelete(id: number, index: number): void {
    this.spinner.show();
    //Условие для удаления созданных постов
    if (id > 100) {
      this.posts.splice(index, 1);
      this.toastr.success('Post deleted success', 'Message');
      this.spinner.hide();
    }//Удаление постов с запросом к серверу
    else {
      this.postService.deletePost(id).subscribe((data: Object) => {
        this.posts = this.posts.filter(post => post.id != id);
        this.toastr.success('Post deleted success', 'Message');
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        this.toastr.error(error.message, 'Error');
      });
    }
  }
}
