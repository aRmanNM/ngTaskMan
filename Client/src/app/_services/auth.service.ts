import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_models/User';
import { NewUser } from '../_models/NewUser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.apiUrl + 'account/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;

  constructor(private http: HttpClient) {}

  login(userToLogin: User) {
    return this.http.post<User>(this.baseUrl + 'login', userToLogin).pipe(
      map((res: User) => {
        if (res) {
          localStorage.setItem('token', res.token);
          this.decodedToken = this.jwtHelper.decodeToken(res.token);
        }
      })
    );
  }

  register(newUser: NewUser) {
    return this.http.post<User>(this.baseUrl + 'register', newUser);
  }

  checkUserExists(email) {
    return this.http.get<boolean>(this.baseUrl + 'emailexists', {
      params: { email },
    });
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  logout() {
    localStorage.removeItem('token');
  }
}
