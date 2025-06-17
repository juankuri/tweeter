import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user/User';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css'],
})
export class NewUserComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  roles: string[] = [];

  constructor(
    private userService: UserService,
    private storageService: StorageService,
    private router: Router
  ) {}

  callSignup() {
    const newUser = {
      username: this.username,
      email: this.email,
      password: this.password,
      role: this.roles.length > 0 ? this.roles : undefined,
    };

    this.userService.postSignup(newUser).subscribe(
      (response) => {
        console.log('User registered:', response);
        alert('User registered successfully!');
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Signup error:', error);
        alert('Error during registration');
      }
    );
  }
}
