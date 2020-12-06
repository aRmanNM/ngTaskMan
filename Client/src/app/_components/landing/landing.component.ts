import { Direction } from '@angular/cdk/bidi/directionality';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  rtl: Direction = 'rtl';
  constructor() { }

  ngOnInit(): void {
  }

}
