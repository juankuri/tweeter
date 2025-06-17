import { Injectable } from '@angular/core';
import { Credential } from '../models/user/Credential';
import { User } from '../models/user/User';
import { Token } from '../models/user/Token';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiURL = 'http://localhost:8080/';

  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }),
  };

  errorMessage = '';

  postLogin(myCredential: Credential) {
    const body = {
      username: myCredential.email,
      password: myCredential.password,
    };

    console.log(body);

    var myToken = new Token();

    return this.http
      .post(this.apiURL + 'api/auth/signin', body, this.httpOptions)
      .pipe(catchError(this.handleError));

    /*  .subscribe( (data : any)  => {
        console.log(data);
        myToken.accessToken = data.accessToken;
     })
*/

    // return myToken;
  }

  postSignup(userData: any) {
    return this.http
      .post(this.apiURL + 'api/auth/signup', userData, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  createUser(myUser: User): User {
    console.log('email ... ' + myUser.email);
    console.log('password ... ' + myUser.password);

    var myNewUser = new User();

    // call fake api - create user
    // Success
    myNewUser.id = 0;

    if (myNewUser.id != 0) {
      console.log('Success ' + myNewUser.id);
      myNewUser.id = 1; // Success
      myNewUser.email = myUser.email;
      myNewUser.firstName = myUser.firstName;
      myNewUser.lastName = myUser.lastName;
      myNewUser.password = myUser.password;
    } else {
      console.log('Error' + myNewUser.id);

      myNewUser.id = 0; // Error
    }

    return myNewUser;
  }

  resetPassword(email: String, password: String, token: String): String {
    // call reset password API

    var isResetPassword = 1;

    this.destroyToken(token);

    return '' + isResetPassword;
  }

  sendUrlResetPassword(email: String): User {
    console.log('email ... ' + email);

    var myUser = this.validateUser(email);

    if (myUser.id != 0) {
      var myUrlReset = this.createUrlReset(myUser.email);
      console.log(myUrlReset);
      var sendEmail = this.sendEmail(myUser.email, myUrlReset);
      console.log(sendEmail);
    }

    return myUser;
  }

  sendEmail(email: String, urlReset: String): String {
    var emailSuccess = 0;

    // send email using SMTP (gmail, outlook..)

    // email sent
    emailSuccess = 1;
    console.log('sent to :' + email);
    console.log('url : ' + urlReset);

    return '' + emailSuccess;
  }
  createUrlReset(email: String): String {
    var myUrlReset =
      '' +
      this.createBaseURL() +
      '/' +
      email +
      '/' +
      this.createTokenReset(email);

    return myUrlReset;
  }

  createBaseURL(): String {
    // call process to create base URL
    var baseURL = 'http://localhost:4200/reset-password';

    return baseURL;
  }

  createTokenReset(email: String): String {
    // JWT create a token to encrypt email
    var SECRET_KEY = 'i-love-adsoftsito';

    var myToken = 'lkjlskiei8093wjdjde9203394';

    return myToken;
  }

  validateUser(email: String): User {
    // call fake query api by email

    var myUser = new User();

    // Success, email valid
    if (email == 'adsoft@live.com.mx') {
      console.log('Success ' + myUser.id);
      myUser.id = 1; // Success
      myUser.email = email;
      myUser.firstName = 'Adolfo';
      myUser.lastName = 'Centeno';
      myUser.password = '';
    } else {
      console.log('Error' + myUser.id);

      myUser.id = 0; // Error
    }

    return myUser;
  }

  validateToken(email: String, token: String): String {
    // call api to validate token
    // success
    console.log('validating token ... ' + token);

    var validToken = 1;
    return '' + validToken;
  }

  destroyToken(token: String): String {
    // call api to destroy token
    var istokenDestroyed = 1;
    console.log('destroying token ... ' + token);
    return '' + istokenDestroyed;
  }

  // Error handling

  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
