import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Post } from "../../models/Post";
import { PostsService } from "../../services/posts.service";

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css']
})
export class PostItemComponent implements OnInit {
  @Input('post') postItem: Post;
  @Output() deletePost: EventEmitter<number> = new EventEmitter();
  @Output() commentPost: EventEmitter<number> = new EventEmitter();
  @Output() editPost: EventEmitter<Post> = new EventEmitter();

  editPostId: number;
  isAdmin = true;

  constructor(
    public postService: PostsService
  ) {}

  ngOnInit() {
    this.postService.editTaskEvent.subscribe((post: Post) => {
      if (post.id === this.postItem.id) {
        this.editPostId = post.id;
      } else {
        this.editPostId = 0;
      }
    });
  }

  onDelete(id: number): void {
    this.deletePost.emit(id);
  }

  showReviews(id: number) {
    this.commentPost.emit(id);
  }

  onEdit(post: Post): void {
    const updtPost = {
      title: post.title,
      body: post.body,
      userId: post.userId,
      id: post.id
    }
    this.editPost.emit(updtPost);
  }

  onCancel(): void {
    this.editPost.emit({title: '', body: '', userId: 1});
  }

}
