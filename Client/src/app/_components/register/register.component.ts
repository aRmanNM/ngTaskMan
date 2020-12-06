import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import { Router } from '@angular/router';
import {
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { of, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Direction } from '@angular/cdk/bidi/directionality';

export class PasswordStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return control.touched && (form.hasError('mismatch') || control.invalid);
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  rtl: Direction = 'rtl';
  matcher = new PasswordStateMatcher();
  passwordPattern = "(?=^.{6,20}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\\s).*$";

  registerForm = new FormGroup(
    {
      displayName: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      email: new FormControl(
        '',
        [Validators.required, Validators.email, Validators.maxLength(30)],
        [this.validateEmailNotTaken()]
      ),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(this.passwordPattern),
        Validators.maxLength(20)
      ]),
      confirmPassword: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    },
    this.passwordMatchValidator
  );

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  register() {
    this.authService.register(this.registerForm.value).subscribe(
      () => {
        this.router.navigate(['/login']);
      },
      (error) => {
        console.log('registeration failed!', error);
      }
    );
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value
      ? null
      : { mismatch: true };
  }

  validateEmailNotTaken(): AsyncValidatorFn {
    return (control) => {
      return timer(500).pipe(
        switchMap(() => {
          if (!control.value) {
            return of(null);
          }
          return this.authService.checkUserExists(control.value).pipe(
            map((res) => {
              return res ? { emailExists: true } : null;
            })
          );
        })
      );
    };
  }
}
