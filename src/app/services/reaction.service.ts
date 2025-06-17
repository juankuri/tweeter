import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Reaction } from '../models/Reaction/Reaction';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { StorageService } from './storage.service';
import { ReactionCount } from '../models/Reaction/ReactionCount';

@Injectable({
  providedIn: 'root',
})
export class ReactionService {
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

  postReaction(reaction: Reaction): Observable<any> {
    const token = this.storageService.getSession('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    console.log('token:', token);

    return this.http
      .post(this.apiURL + 'api/reactions/create', reaction, httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  // Error handling
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }

  getReactionsByTweetId(tweetId: number): Observable<ReactionCount[]> {
    return this.http.get<ReactionCount[]>(
      `${this.apiURL}api/reactions/counts-by-type/${tweetId}`,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.storageService.getSession('token')}`,
        }),
      }
    );
  }

  toggleReaction(reaction: Reaction): Observable<any> {
    const token = this.storageService.getSession('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.put(this.apiURL + 'api/reactions/toggle', reaction, {
      headers,
      responseType: 'text', 
    });
  }
}
