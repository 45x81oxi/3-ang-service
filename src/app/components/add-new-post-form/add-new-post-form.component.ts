import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Post } from "../../models/Post";
import { PostsService } from "../../services/posts.service";
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-add-new-post-form',
  templateUrl: './add-new-post-form.component.html',
  styleUrls: ['./add-new-post-form.component.css']
})

export class AddNewPostFormComponent implements OnInit {
  @Output() onAddNewPost: EventEmitter<Post> = new EventEmitter();
  @Output() onUpdateNewPost: EventEmitter<Post> = new EventEmitter();
  @ViewChild('form') form: NgForm;
  formData: Post = {
    userId: 1,
    title: "",
    body: ""
  };

  constructor(
    public  postService: PostsService,
    public  toastr: ToastrService,
    public  spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.postService.editTaskEvent.subscribe((post: Post) => {
      this.formData = post;
    });
  }

  onAddPost(): void {
    this.spinner.show();
    const newPost: Post = {
      title: this.formData.title,
      body: this.formData.body,
      userId: this.formData.userId
    };

    this.postService.addPost(newPost).subscribe((data: Post) => {
      if (data.id) {
        this.onAddNewPost.emit(data);
        this.toastr.success('News successfully added', 'Message');
      }
    }, error => {
      this.toastr.error(error.message, 'Error');
    });

    this.onCancel();
  }

  onEditPost(): void {
    this.spinner.show();
    const updtPost: Post = {
      title: this.formData.title,
      body: this.formData.body,
      userId: this.formData.userId,
      id: this.formData.id
    };
    this.postService.editPost(updtPost).subscribe((data: Post) => {
      if (data.id) {
        this.onUpdateNewPost.emit(data);
        this.formData.id = 0;
        this.toastr.success('Post successfully updated', 'Message');
      }
    }, error => {
      this.toastr.error(error.message, 'Error');
    });
    this.onCancel();
  }

  onCancel(): void {
    this.postService.emitEditEvent({title: '', body: '', userId: 1});
    this.form.resetForm();
  }
}
