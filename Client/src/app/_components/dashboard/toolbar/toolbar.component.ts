import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../../_services/auth.service';
import { Router } from '@angular/router';
import { Direction } from '@angular/cdk/bidi/directionality';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  value: string;
  searchBox = false;
  rtl: Direction = 'rtl';

  @Output() onSearch = new EventEmitter<string>();

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleSearchBox() {
    this.searchBox = !this.searchBox;
    this.value = '';
    this.doSearch();
  }

  doSearch() {
    setTimeout(() => {
      this.onSearch.emit(this.value);
    }, 1000);
  }

  clearSearchBox() {
    this.value = '';
    this.doSearch();
  }
}
