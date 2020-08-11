import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { authInitiateLogin } from 'src/app/auth/store/auth.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  logInHostedUi() {
    this.router.navigateByUrl('/login');
  }

  logInCustom() {
    this.router.navigateByUrl('/login-custom');
  }
}
