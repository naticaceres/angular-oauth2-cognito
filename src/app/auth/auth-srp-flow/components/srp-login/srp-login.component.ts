import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as SrpAuthActions from '../../store/srp-auth.actions';

@Component({
  selector: 'app-srp-login',
  templateUrl: './srp-login.component.html',
  styleUrls: ['./srp-login.component.css']
})
export class SrpLoginComponent implements OnInit {
  public loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmitLogin(value: any) {
    const username = value.email;
    const password = value.password;
    this.store.dispatch(
      SrpAuthActions.initiateSrpAuthLogin({ authData: { username, password } })
    );
  }
}
