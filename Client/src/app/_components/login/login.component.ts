import { Component, DoCheck, OnInit } from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Direction } from '@angular/cdk/bidi/directionality';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  error: string;
  rtl: Direction = 'rtl';

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    password: new FormControl('', [Validators.required, Validators.maxLength(20)]),
  });

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  login() {
    this.error = null;
    this.authService.login(this.loginForm.value).subscribe(
      () => {
        this.router.navigate(['/dashboard']);
      },
      (er) => {
        this.error = er.error.message;
        this.loginForm.reset();
        console.log('login failed!');
      }
    );
  }
}
