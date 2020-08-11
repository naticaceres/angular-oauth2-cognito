import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CustomAuthService } from '../../services/custom-auth.service';
import { Store } from '@ngrx/store';
import { customAuthInitiateLogin } from '../../store/auth.actions';

@Component({
  selector: 'app-custom-login',
  templateUrl: './custom-login.component.html',
  styleUrls: ['./custom-login.component.css']
})
export class CustomLoginComponent implements OnInit {
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
    const email = value.email;
    const password = value.password;
    //this.customAuthService.initiateLogIn(email, password);
    this.store.dispatch(customAuthInitiateLogin({ email, password }));
  }
}
