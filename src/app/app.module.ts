import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PostsService } from "./services/posts.service";
import { PostsComponent } from './components/posts/posts.component';
import { HttpClientModule } from "@angular/common/http";
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PostsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    ToastrModule.forRoot(),
    FormsModule
  ],
  providers: [PostsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
