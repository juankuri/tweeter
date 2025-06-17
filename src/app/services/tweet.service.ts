import { Injectable } from '@angular/core';
import { Tweet } from '../models/tweets/Tweet';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class TweetService {
  apiURL = 'http://localhost:8080/';
  token = '';
  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
    this.token = this.storageService.getSession('token');
    console.log(this.token);
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: 'Bearer ' + this.token,
    }),
  };

  errorMessage = '';

  getTweets(): Observable<any> {
    console.log('tweets: ' + this.apiURL + 'api/tweets/with-comments');
    return this.http
      .get<any>(this.apiURL + 'api/tweets/with-comments')
      .pipe(catchError(this.handleError));
  }

  // Error handling
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  postTweet(myTweet: String) {
    const token = this.storageService.getSession('token');
    if (!token) {
      console.error('No token found in session storage');
      return throwError('No token found in session storage');
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: 'Bearer ' + token,
    });
    this.httpOptions.headers = headers;
    const body = {
      tweet: myTweet,
    };

    console.log(body);
    return this.http
      .post(this.apiURL + 'api/tweets/create', body, { headers })
      .pipe(catchError(this.handleError));
  }
  postComment(commentText: string, parentId: number) {
    const token = this.storageService.getSession('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    });

    const body = {
      tweet: commentText,
      parentId: parentId,
    };

    return this.http
      .post(this.apiURL + 'api/tweets/create', body, { headers })
      .pipe(catchError(this.handleError));
  }
}
