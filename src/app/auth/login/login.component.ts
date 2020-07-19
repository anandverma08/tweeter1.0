import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  userAuthSubs : Subscription;
  constructor(private authService: AuthService) { }
  ngOnInit(): void {
    this.userAuthSubs = this.authService.getUserAuthenticationStatus().subscribe(()=>{
      this.isLoading = false;
    });
  }
  ngOnDestroy(){
    this.userAuthSubs.unsubscribe();
  }

  onLogin(form: NgForm) {
    console.log(form);
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
  }
}
